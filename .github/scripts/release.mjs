import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
    appendFileSync,
    mkdirSync,
    mkdtempSync,
    readFileSync,
    readdirSync,
    rmSync,
    writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const output = resolve(root, '.release');
const registry = 'https://registry.npmjs.org';
const directories = ['packages/intl', 'packages/core', 'packages/react', 'packages/nextjs'];
const repository = 'prezly/theme-kit-js';
const branch = 'main';
const command = process.argv[2];
const tag = process.argv[3] ?? 'latest';
assert(
    ['pack', 'dry-run', 'publish', 'verify'].includes(command),
    'Expected pack, dry-run, publish or verify',
);
assert(['latest', 'next'].includes(tag), 'Expected latest or next');
const json = (file) => JSON.parse(readFileSync(file, 'utf8'));
const run = (bin, args, cwd = root) => execFileSync(bin, args, { cwd, stdio: 'inherit' });
const capture = (bin, args) =>
    execFileSync(bin, args, { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }).trim();
const sources = directories.map((dir) => ({ dir, ...json(resolve(root, dir, 'package.json')) }));
const digest = (file) =>
    `sha512-${createHash('sha512').update(readFileSync(file)).digest('base64')}`;
const report = (message) => {
    console.log(message);
    if (process.env.GITHUB_STEP_SUMMARY)
        appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${message}\n\n`);
};

// Inspect the actual archive, not the source package.json. pnpm rewrites workspace ranges.
function inspect(file, source) {
    const packed = JSON.parse(capture('tar', ['-xOf', file, 'package/package.json']));
    const files = capture('tar', ['-tzf', file]).split('\n');
    assert.equal(packed.name, source.name);
    assert.equal(packed.version, source.version);
    assert(!packed.private, `${packed.name} is private`);
    assert.equal(packed.repository?.url, `git+https://github.com/${repository}.git`);
    assert.match(packed.version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
    assert(tag !== 'latest' || !packed.version.includes('-'), 'Prereleases must use next');
    for (const section of [
        'dependencies',
        'optionalDependencies',
        'peerDependencies',
        'devDependencies',
    ]) {
        for (const [name, range] of Object.entries(packed[section] ?? {})) {
            assert(
                !/^(workspace:|file:|link:)/.test(range),
                `${packed.name}: unresolved ${name}: ${range}`,
            );
            if (source[section]?.[name]?.startsWith('workspace:')) {
                const dependency = sources.find((item) => item.name === name);
                assert(dependency, `Unreleased workspace dependency: ${name}`);
                assert.equal(
                    range,
                    `^${dependency.version}`,
                    `Unexpected packed workspace range for ${name}`,
                );
                assert(
                    sources.indexOf(dependency) < sources.indexOf(source),
                    'Publish dependencies first',
                );
            }
        }
    }
    function checkTarget(target) {
        if (!target) return;
        if (typeof target === 'object') {
            for (const value of Object.values(target)) checkTarget(value);
            return;
        }
        const path = `package/${target.replace(/^\.\//, '')}`;
        const prefix = path.split('*')[0];
        assert(
            files.some(
                (file) =>
                    file === path ||
                    file.startsWith(`${path}/`) ||
                    (path.includes('*') && file.startsWith(prefix)),
            ),
            `Missing package target: ${target}`,
        );
    }
    for (const field of ['main', 'module', 'types', 'style', 'exports']) checkTarget(packed[field]);
    return { name: packed.name, version: packed.version, file, integrity: digest(file) };
}

// Test installation outside the workspace so local symlinks cannot hide packaging errors.
function install(packages, published = false) {
    const directory = mkdtempSync(resolve(tmpdir(), 'prezly-release-'));
    try {
        writeFileSync(resolve(directory, 'package.json'), JSON.stringify({ private: true }));
        const specs = packages.map((pkg) => (published ? `${pkg.name}@${pkg.version}` : pkg.file));
        run(
            'npm',
            [
                'install',
                '--ignore-scripts',
                '--no-audit',
                '--no-fund',
                '--package-lock=false',
                `--registry=${registry}`,
                ...specs,
            ],
            directory,
        );
        const names = packages.map((pkg) => pkg.name);
        writeFileSync(
            resolve(directory, 'smoke.cjs'),
            `for (const name of ${JSON.stringify(names)}) require(name);\n`,
        );
        writeFileSync(
            resolve(directory, 'smoke.mjs'),
            `for (const name of ${JSON.stringify(names)}) await import(name);\n`,
        );
        run('node', ['smoke.cjs'], directory);
        run('node', ['smoke.mjs'], directory);
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
}

async function metadata(pkg) {
    // Only a missing VERSION on a successfully fetched package is considered unpublished.
    // Authentication, network and registry errors must never become permission to publish.
    const response = await fetch(`${registry}/${encodeURIComponent(pkg.name)}`, {
        signal: AbortSignal.timeout(30000),
    });
    assert(response.ok, `Registry lookup failed for ${pkg.name}: HTTP ${response.status}`);
    return response.json();
}

if (command === 'pack') {
    rmSync(output, { recursive: true, force: true });
    mkdirSync(output);
    for (const source of sources)
        run('pnpm', ['pack', '--pack-destination', output], resolve(root, source.dir));
}
const files = readdirSync(output).filter((file) => file.endsWith('.tgz'));
assert.equal(files.length, sources.length, 'Unexpected number of release tarballs');
const packages = sources.map((source) => {
    const file = resolve(
        output,
        `${source.name.replace('@', '').replace('/', '-')}-${source.version}.tgz`,
    );
    return inspect(file, source);
});

if (command === 'pack') {
    install(packages);
    writeFileSync(
        resolve(output, 'manifest.json'),
        JSON.stringify({ commit: capture('git', ['rev-parse', 'HEAD']), tag, packages }, null, 2) +
            '\n',
    );
    report(
        `Validated tarballs and fresh consumer installation: ${packages.map((pkg) => `${pkg.name}@${pkg.version}`).join(', ')}`,
    );
} else if (command === 'verify') {
    for (const pkg of packages) {
        const data = await metadata(pkg);
        assert.equal(
            data.versions?.[pkg.version]?.dist?.integrity,
            pkg.integrity,
            `${pkg.name}: published bytes differ`,
        );
        assert.equal(data['dist-tags']?.[tag], pkg.version, `${pkg.name}: unexpected ${tag} tag`);
    }
    install(packages, true);
    report('Registry integrity, dist-tags, fresh install, CommonJS and ESM imports verified.');
} else {
    if (command === 'publish') {
        assert.equal(process.env.GITHUB_ACTIONS, 'true', 'Publish only through GitHub Actions');
        assert.equal(process.env.GITHUB_REPOSITORY, repository);
        assert.equal(process.env.GITHUB_REF, `refs/heads/${branch}`);
        assert.equal(process.env.GITHUB_EVENT_NAME, 'workflow_dispatch');
        assert(process.env.ACTIONS_ID_TOKEN_REQUEST_URL, 'Missing OIDC permission');
        const [major, minor, patch] = capture('npm', ['--version']).split('.').map(Number);
        assert(
            major > 11 || (major === 11 && (minor > 5 || (minor === 5 && patch >= 1))),
            'npm >=11.5.1 required',
        );
    }
    const plan = [];
    // Preflight ALL packages before the first write, including previously published versions.
    for (const pkg of packages) {
        const data = await metadata(pkg);
        const existing = data.versions?.[pkg.version];
        const identical = existing?.dist?.integrity === pkg.integrity;
        const tagged = data['dist-tags']?.[tag] === pkg.version;
        report(
            `${pkg.name}@${pkg.version}: ${existing ? (identical && tagged ? 'already published, identical bytes and tag' : 'version exists with different bytes or tag; real release blocked') : `ready for ${tag}`}`,
        );
        if (command === 'publish' && existing) {
            assert(
                identical && tagged,
                `${pkg.name}: existing version differs. See release recovery documentation.`,
            );
        }
        plan.push({ ...pkg, skip: Boolean(existing) });
        // npm also rejects existing versions in dry-run mode. They were inspected above.
        if (!existing) {
            run('npm', [
                'publish',
                pkg.file,
                '--dry-run',
                '--ignore-scripts',
                '--access=public',
                `--tag=${tag}`,
                `--registry=${registry}`,
            ]);
        } else {
            report(`Skipping npm publish --dry-run for existing ${pkg.name}@${pkg.version}`);
        }
    }
    if (command === 'publish') {
        if (plan.every((pkg) => pkg.skip))
            report(
                'All versions already exist. No publish performed; OIDC authentication was not exercised.',
            );
        for (const pkg of plan) {
            if (pkg.skip) continue;
            run('npm', [
                'publish',
                pkg.file,
                '--ignore-scripts',
                '--access=public',
                `--tag=${tag}`,
                `--registry=${registry}`,
            ]);
            // Wait for registry propagation before moving on to dependent packages.
            let visible = false;
            for (let attempt = 0; attempt < 12; attempt++) {
                const data = await metadata(pkg);
                if (
                    data.versions?.[pkg.version]?.dist?.integrity === pkg.integrity &&
                    data['dist-tags']?.[tag] === pkg.version
                ) {
                    visible = true;
                    break;
                }
                await new Promise((done) => setTimeout(done, 5000));
            }
            assert(
                visible,
                `${pkg.name}: registry verification timed out; see recovery documentation`,
            );
            report(`Published and verified ${pkg.name}@${pkg.version}`);
        }
    }
}
