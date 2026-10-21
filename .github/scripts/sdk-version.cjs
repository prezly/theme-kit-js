const assert = require('node:assert/strict');
const fs = require('node:fs');
const { createRequire } = require('node:module');
const path = require('node:path');

const [command, version] = process.argv.slice(2);
assert.match(version ?? '', /^\d+\.\d+\.\d+$/);
const root = path.resolve(__dirname, '../..');

if (command === 'select') {
    const manifestPath = path.join(root, 'package.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.devDependencies['@prezly/sdk'] = version;
    manifest.pnpm ??= {};
    manifest.pnpm.overrides ??= {};
    // Pin auto-installed workspace peers as well as the root devDependency.
    manifest.pnpm.overrides['@prezly/sdk'] = version;
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`);
} else {
    assert.equal(command, 'verify', 'Expected select or verify');
    for (const directory of ['.', 'packages/core', 'packages/nextjs']) {
        const requireFromPackage = createRequire(path.join(root, directory, 'package.json'));
        const entry = requireFromPackage.resolve('@prezly/sdk');
        let packageDirectory = path.dirname(entry);
        while (true) {
            const manifestPath = path.join(packageDirectory, 'package.json');
            if (fs.existsSync(manifestPath)) {
                const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
                if (manifest.name === '@prezly/sdk') {
                    console.log(`${directory}: @prezly/sdk ${manifest.version} (${entry})`);
                    assert.equal(manifest.version, version, `${directory} SDK version mismatch`);
                    break;
                }
            }
            const parent = path.dirname(packageDirectory);
            assert.notEqual(parent, packageDirectory, `Cannot find SDK manifest for ${entry}`);
            packageDirectory = parent;
        }
    }
}
