import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
    chmodSync,
    copyFileSync,
    mkdirSync,
    mkdtempSync,
    readFileSync,
    realpathSync,
    rmSync,
    writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import test from 'node:test';

const definitions = [
    ['packages/intl', '@prezly/theme-kit-intl'],
    ['packages/core', '@prezly/theme-kit-core'],
    ['packages/react', '@prezly/theme-kit-react'],
    ['packages/nextjs', '@prezly/theme-kit-nextjs'],
];
const repository = 'prezly/theme-kit-js';
const branch = 'main';
function fixture(options = {}) {
    const root = realpathSync(mkdtempSync(resolve(tmpdir(), 'release-test-')));
    mkdirSync(resolve(root, '.github/scripts'), { recursive: true });
    mkdirSync(resolve(root, '.release'));
    mkdirSync(resolve(root, 'bin'));
    copyFileSync(
        new URL('./release.mjs', import.meta.url),
        resolve(root, '.github/scripts/release.mjs'),
    );
    const metadata = {};
    for (const [index, [directory, name]] of definitions.entries()) {
        const version = options.prerelease ? '1.0.0-next.0' : '1.0.0';
        const manifest = {
            name,
            version,
            main: 'build/index.cjs',
            repository: { url: `git+https://github.com/${repository}.git` },
        };
        mkdirSync(resolve(root, directory), { recursive: true });
        writeFileSync(resolve(root, directory, 'package.json'), JSON.stringify(manifest));
        const staging = resolve(root, `staging-${index}`);
        mkdirSync(resolve(staging, 'package/build'), { recursive: true });
        if (options.workspace) manifest.dependencies = { unexpected: 'workspace:^' };
        writeFileSync(resolve(staging, 'package/package.json'), JSON.stringify(manifest));
        if (!options.missingEntry)
            writeFileSync(resolve(staging, 'package/build/index.cjs'), 'module.exports = {};');
        const file = resolve(
            root,
            '.release',
            `${name.replace('@', '').replace('/', '-')}-${version}.tgz`,
        );
        execFileSync('tar', ['-czf', file, '-C', staging, 'package']);
        const integrity = `sha512-${createHash('sha512').update(readFileSync(file)).digest('base64')}`;
        metadata[name] = {
            version,
            integrity,
            file,
            existing:
                options.existing ||
                (options.partial && index === 0) ||
                (options.conflict && index === definitions.length - 1),
            conflict: options.conflict && index === definitions.length - 1,
        };
    }
    writeFileSync(resolve(root, 'metadata.json'), JSON.stringify(metadata));
    writeFileSync(resolve(root, 'calls'), '');
    const npm = resolve(root, 'bin/npm');
    writeFileSync(
        npm,
        `#!/usr/bin/env node\nconst fs = require('node:fs');\nif (process.argv[2] === '--version') console.log('11.15.0');\nelse fs.appendFileSync(process.env.TEST_CALLS, JSON.stringify(process.argv.slice(2)) + '\\n');\n`,
    );
    chmodSync(npm, 0o755);
    // No request reaches npm. Model registry propagation after the mocked publish.
    writeFileSync(
        resolve(root, 'registry.mjs'),
        `
import fs from 'node:fs';
const packages = JSON.parse(fs.readFileSync(process.env.TEST_METADATA));
globalThis.fetch = async (url) => {
    if (process.env.TEST_REGISTRY_FAIL) return { ok: false, status: 503 };
    const name = decodeURIComponent(new URL(url).pathname.slice(1));
    const pkg = packages[name];
    const calls = fs.readFileSync(process.env.TEST_CALLS, 'utf8').trim().split('\\n').filter(Boolean).map(JSON.parse);
    const published = calls.some((args) => args[0] === 'publish' && args[1] === pkg.file && !args.includes('--dry-run'));
    const exists = pkg.existing || published;
    return { ok: true, json: async () => ({ versions: exists ? { [pkg.version]: { dist: { integrity: pkg.conflict ? 'different' : pkg.integrity } } } : {}, 'dist-tags': exists ? { latest: pkg.version } : {} }) };
};
`,
    );
    return {
        run(command = 'publish', extraEnv = {}) {
            return spawnSync(
                process.execPath,
                [
                    '--import',
                    resolve(root, 'registry.mjs'),
                    resolve(root, '.github/scripts/release.mjs'),
                    command,
                    'latest',
                ],
                {
                    cwd: root,
                    encoding: 'utf8',
                    env: {
                        ...process.env,
                        PATH: `${resolve(root, 'bin')}:${process.env.PATH}`,
                        GITHUB_ACTIONS: 'true',
                        GITHUB_REPOSITORY: repository,
                        GITHUB_REF: `refs/heads/${branch}`,
                        GITHUB_EVENT_NAME: 'workflow_dispatch',
                        ACTIONS_ID_TOKEN_REQUEST_URL: 'test',
                        TEST_CALLS: resolve(root, 'calls'),
                        TEST_METADATA: resolve(root, 'metadata.json'),
                        GITHUB_STEP_SUMMARY: '',
                        ...extraEnv,
                    },
                },
            );
        },
        writes() {
            return readFileSync(resolve(root, 'calls'), 'utf8')
                .trim()
                .split('\n')
                .filter(Boolean)
                .map(JSON.parse)
                .filter((args) => args[0] === 'publish' && !args.includes('--dry-run'));
        },
        cleanup() {
            rmSync(root, { recursive: true, force: true });
        },
    };
}

for (const [name, options, expected] of [
    ['rejects workspace protocols in packed manifests', { workspace: true }, /unresolved/],
    ['rejects missing exports', { missingEntry: true }, /Missing package target/],
    ['rejects prereleases on latest', { prerelease: true }, /Prereleases must use next/],
    ['preflights every version before writing', { conflict: true }, /existing version differs/],
]) {
    test(name, (t) => {
        const f = fixture(options);
        t.after(() => f.cleanup());
        const result = f.run();
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, expected);
        assert.deepEqual(f.writes(), []);
    });
}
for (const [name, env] of [
    ['local publishing', { GITHUB_ACTIONS: '' }],
    ['non-default branches', { GITHUB_REF: 'refs/heads/feature' }],
    ['registry failures', { TEST_REGISTRY_FAIL: 'true' }],
]) {
    test(`rejects ${name}`, (t) => {
        const f = fixture();
        t.after(() => f.cleanup());
        assert.notEqual(f.run('publish', env).status, 0);
        assert.deepEqual(f.writes(), []);
    });
}
test('dry run never publishes, even when existing versions differ', (t) => {
    const f = fixture({ conflict: true });
    t.after(() => f.cleanup());
    const result = f.run('dry-run');
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(f.writes(), []);
});
test('retry skips byte-identical published versions', (t) => {
    const f = fixture({ existing: true });
    t.after(() => f.cleanup());
    const result = f.run();
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(f.writes(), []);
});
test('publishes dependencies before consumers', (t) => {
    const f = fixture();
    t.after(() => f.cleanup());
    const result = f.run();
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(
        f.writes().map((args) => args[1].split('/').pop()),
        definitions.map(([, name]) => `${name.replace('@', '').replace('/', '-')}-1.0.0.tgz`),
    );
});

if (definitions.length > 1) {
    test('resumes a partial release without republishing its dependency', (t) => {
        const f = fixture({ partial: true });
        t.after(() => f.cleanup());
        const result = f.run();
        assert.equal(result.status, 0, result.stderr);
        assert.deepEqual(
            f.writes().map((args) => args[1].split('/').pop()),
            definitions
                .slice(1)
                .map(([, name]) => `${name.replace('@', '').replace('/', '-')}-1.0.0.tgz`),
        );
    });
}
