import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { readReleaseVersion } from './release-tag.mjs';

export async function ensureGitHubRelease({
    version,
    channel,
    sha,
    repository,
    token,
    request = fetch,
}) {
    assert.match(version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
    assert(['latest', 'next'].includes(channel), 'Expected latest or next');
    assert(channel !== 'latest' || !version.includes('-'), 'Prerelease versions require next');
    assert.match(sha, /^[a-f0-9]{40}$/);
    assert.equal(repository, 'prezly/theme-kit-js');
    assert(token, 'GitHub workflow token is required');
    const tag = `v${version}`;
    async function api(path, method = 'GET', body = null) {
        const response = await request(`https://api.github.com/repos/${repository}/${path}`, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github+json',
                'Content-Type': 'application/json',
                'X-GitHub-Api-Version': '2022-11-28',
            },
            ...(body ? { body: JSON.stringify(body) } : {}),
            signal: AbortSignal.timeout(30000),
        });
        if (method === 'GET' && path === `releases/tags/${tag}` && response.status === 404)
            return null;
        assert(response.ok, `GitHub ${path} failed: HTTP ${response.status}`);
        return response.json();
    }
    // Require the verified tag. Never let release creation implicitly create a tag.
    let object = (await api(`git/ref/tags/${tag}`)).object;
    for (let depth = 0; object?.type === 'tag' && depth < 10; depth++) {
        object = (await api(`git/tags/${object.sha}`)).object;
    }
    assert.equal(object?.type, 'commit', `Cannot resolve ${tag} to a commit`);
    assert.equal(object.sha, sha, `${tag} points to another commit`);

    const existing = await api(`releases/tags/${tag}`);
    const flags = {
        draft: false,
        prerelease: channel === 'next',
        make_latest: channel === 'latest' ? 'true' : 'false',
    };
    // Preserve existing titles and notes when recovering a partially completed release.
    const release = existing
        ? await api(`releases/${existing.id}`, 'PATCH', flags)
        : await api('releases', 'POST', {
              tag_name: tag,
              target_commitish: sha,
              name: tag,
              generate_release_notes: true,
              ...flags,
          });
    assert.equal(release.tag_name, tag);
    assert.equal(release.draft, false);
    assert.equal(release.prerelease, flags.prerelease);
    if (channel === 'latest') {
        assert.equal(
            (await api('releases/latest')).id,
            release.id,
            `${tag} is not the latest release`,
        );
    }
    return `GitHub Release ready: ${release.html_url}`;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
    assert.equal(process.env.GITHUB_ACTIONS, 'true');
    assert.equal(process.env.GITHUB_EVENT_NAME, 'workflow_dispatch');
    assert.equal(process.env.GITHUB_REF, 'refs/heads/main');
    const version = readReleaseVersion();
    console.log(
        await ensureGitHubRelease({
            version,
            channel: process.env.DIST_TAG,
            sha: process.env.GITHUB_SHA,
            repository: process.env.GITHUB_REPOSITORY,
            token: process.env.GH_TOKEN,
        }),
    );
}
