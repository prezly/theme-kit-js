import assert from 'node:assert/strict';
import test from 'node:test';
import { ensureGitHubRelease } from './github-release.mjs';

const sha = 'a'.repeat(40);
const defaults = {
    version: '1.2.3',
    channel: 'latest',
    sha,
    repository: 'prezly/theme-kit-js',
    token: 'test',
};
const tag = { object: { type: 'commit', sha } };
const release = {
    id: 123,
    tag_name: 'v1.2.3',
    draft: false,
    prerelease: false,
    html_url: 'https://github.com/release',
};
function mock(responses) {
    const calls = [];
    return {
        calls,
        request: async (url, options) => {
            calls.push({
                path: url.split(`${defaults.repository}/`)[1],
                method: options.method,
                body: options.body && JSON.parse(options.body),
            });
            assert(responses.length, 'Unexpected API request');
            const [status, data] = responses.shift();
            return { status, ok: status >= 200 && status < 300, json: async () => data };
        },
    };
}
test('stable publication creates a latest release with generated notes at the verified tag', async () => {
    const api = mock([[200, tag], [404], [201, release], [200, release]]);
    await ensureGitHubRelease({ ...defaults, ...api });
    assert.deepEqual(api.calls[2], {
        path: 'releases',
        method: 'POST',
        body: {
            tag_name: 'v1.2.3',
            target_commitish: sha,
            name: 'v1.2.3',
            generate_release_notes: true,
            draft: false,
            prerelease: false,
            make_latest: 'true',
        },
    });
    assert.equal(api.calls[3].path, 'releases/latest');
});
test('next creates a prerelease without taking over latest, including for a stable version', async () => {
    const api = mock([[200, tag], [404], [201, { ...release, prerelease: true }]]);
    await ensureGitHubRelease({ ...defaults, ...api, channel: 'next' });
    assert.equal(api.calls[2].body.prerelease, true);
    assert.equal(api.calls[2].body.make_latest, 'false');
});
test('retry reuses an annotated tag and existing release while preserving edited notes and title', async () => {
    const api = mock([
        [200, { object: { type: 'tag', sha: 'b'.repeat(40) } }],
        [200, tag],
        [200, { ...release, name: 'Edited title', body: 'Edited notes' }],
        [200, release],
        [200, release],
    ]);
    await ensureGitHubRelease({ ...defaults, ...api });
    assert.deepEqual(
        api.calls.filter((call) => call.method !== 'GET'),
        [
            {
                path: 'releases/123',
                method: 'PATCH',
                body: { draft: false, prerelease: false, make_latest: 'true' },
            },
        ],
    );
});
for (const [label, responses, error] of [
    ['missing tag', [[404]], /HTTP 404/],
    [
        'wrong commit',
        [[200, { object: { type: 'commit', sha: 'c'.repeat(40) } }]],
        /another commit/,
    ],
    ['tag permission error', [[403]], /HTTP 403/],
    ['release permission error', [[200, tag], [403]], /HTTP 403/],
    ['release server error', [[200, tag], [500]], /HTTP 500/],
]) {
    test(`${label} stops before any write`, async () => {
        const api = mock(responses);
        await assert.rejects(ensureGitHubRelease({ ...defaults, ...api }), error);
        assert(api.calls.every((call) => call.method === 'GET'));
    });
}
test('a rejected creation is not reported as success', async () => {
    const api = mock([[200, tag], [404], [422]]);
    await assert.rejects(ensureGitHubRelease({ ...defaults, ...api }), /HTTP 422/);
});
test('a release not marked latest is not reported as success', async () => {
    const api = mock([[200, tag], [404], [201, release], [200, { ...release, id: 456 }]]);
    await assert.rejects(ensureGitHubRelease({ ...defaults, ...api }), /not the latest release/);
});
test('invalid channel and prerelease on latest stop before contacting GitHub', async () => {
    for (const overrides of [{ channel: 'other' }, { version: '1.2.3-beta.1' }]) {
        const api = mock([]);
        await assert.rejects(ensureGitHubRelease({ ...defaults, ...api, ...overrides }));
        assert.equal(api.calls.length, 0);
    }
});
