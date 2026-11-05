import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export function readReleaseVersion(root = new URL('../../', import.meta.url)) {
    const { version } = JSON.parse(readFileSync(new URL('lerna.json', root)));
    for (const name of ['intl', 'core', 'react', 'nextjs']) {
        const manifest = JSON.parse(readFileSync(new URL(`packages/${name}/package.json`, root)));
        assert.equal(manifest.version, version, `${name} must match the version in lerna.json`);
    }
    return version;
}

export async function ensureReleaseTag({ mode, version, sha, repository, token, request = fetch }) {
    assert(['check', 'create'].includes(mode), 'Expected check or create');
    assert.match(version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
    assert.match(sha, /^[a-f0-9]{40}$/);
    assert.equal(repository, 'prezly/theme-kit-js');
    assert(token, 'GitHub workflow token is required');
    const tag = `v${version}`;
    async function api(path, body) {
        const response = await request(`https://api.github.com/repos/${repository}/git/${path}`, {
            method: body ? 'POST' : 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github+json',
                'Content-Type': 'application/json',
                'X-GitHub-Api-Version': '2022-11-28',
            },
            ...(body ? { body: JSON.stringify(body) } : {}),
            signal: AbortSignal.timeout(30000),
        });
        if (!body && path.startsWith('ref/tags/') && response.status === 404) return null;
        assert(response.ok, `GitHub ${path} failed: HTTP ${response.status}`);
        return response.json();
    }
    const existing = await api(`ref/tags/${tag}`);
    if (existing) {
        let object = existing.object;
        // Resolve annotated tags as well as lightweight tags. Never move an existing tag.
        for (let depth = 0; object?.type === 'tag' && depth < 10; depth++) {
            object = (await api(`tags/${object.sha}`)).object;
        }
        assert.equal(object?.type, 'commit', `Cannot resolve ${tag} to a commit`);
        assert.equal(object.sha, sha, `${tag} already points to another commit`);
        return `${tag} already points to ${sha}`;
    }
    if (mode === 'check') return `${tag} is available for ${sha}`;
    const annotated = await api('tags', {
        tag,
        message: tag,
        object: sha,
        type: 'commit',
    });
    await api('refs', { ref: `refs/tags/${tag}`, sha: annotated.sha });
    const created = await api(`ref/tags/${tag}`);
    assert.equal(created?.object?.sha, annotated.sha, `Could not verify ${tag}`);
    return `Created ${tag} at ${sha}`;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
    const mode = process.argv[2];
    if (mode === 'create') {
        assert.equal(process.env.GITHUB_ACTIONS, 'true');
        assert.equal(process.env.GITHUB_EVENT_NAME, 'workflow_dispatch');
        assert.equal(process.env.GITHUB_REF, 'refs/heads/main');
    }
    const version = readReleaseVersion();
    console.log(
        await ensureReleaseTag({
            mode,
            version,
            sha: process.env.GITHUB_SHA,
            repository: process.env.GITHUB_REPOSITORY,
            token: process.env.GH_TOKEN,
        }),
    );
}
