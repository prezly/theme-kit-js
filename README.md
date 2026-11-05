# Prezly JavaScript Theme Kit

This is a monorepo for Prezly JavaScript Theme Kit packages.

See individual package READMEs for more information:

- [@prezly/theme-kit-core](./packages/core#readme)
- [@prezly/theme-kit-nextjs](./packages/nextjs#readme)
- [@prezly/theme-kit-react](./packages/react#readme)
- [@prezly/theme-kit-intl](./packages/intl#readme)

The unused `packages/ui` directory is excluded from the workspace, builds, and releases.

## Working with the repo locally

### Getting started

After pulling the repo, run `pnpm i` to install the dependencies. This will install the root dependencies, as well as dependencies for individual packages.

### NPM scripts

The repo is designed to run all of the scripts from the root directory with the help of [Lerna] and [Nx].
This ensures that all tasks are aware of dependencies between packages. Nx also provides caching, which speeds up the repeated tasks.
You can learn more about task pipeline configuration from [Lerna docs](https://lerna.js.org/docs/concepts/task-pipeline-configuration).

For convenient development of individual packages, you have the `dev:` npm scripts. Each script will start the selected package in watch mode. Changes to both the package and its dependencies will result in a new build, so you only need to run a single script when working on packages.

### Prezly SDK dependency

We aim to support the broadest range of Prezly SDK version.<br/>
One of the ways to achieve that is by using the smallest subset of SDK entity fields as possible. This is mainly reflected in the types, which are using `Pick<Type, ...>`, rather than a full `Type`. Please aim to only require properties that are actually needed in the helpers.

Prezly SDK has a tendency to introduce major releases that are not necessary breaking the Theme Kit or Theme applications. In order to ensure safety of operation, we specify the upper boundary of SDK version. If there's a new major SDK release that doesn't break Theme Kit functionality, you can safely release a minor Theme Kit version with increased version range to support that SDK version.

GitHub Actions are set up with a version matrix to ensure compatibility with all currently supported versions. Please keep the matrix in sync with the peer dependency version range.

SDK 26 support requires `@prezly/sdk >=26.16.0 <27` and Node.js 22 or newer.
SDK `21.12.0` and `23.x` from `23.0.1` remain supported. SDK `23.0.0` is excluded
because failed requests can leave promises pending; `23.0.1` fixes rejection
propagation. Development and CI use Node.js 22 so that all supported SDK versions
can be tested.

### DEV-24508 release order

The theme PRs using Theme Kit 10.12.0 and SDK 26.16.0 must wait for the SDK 26
compatibility release. Version 10.12.0 excludes SDK 26 from its peer range.

1. Merge the SDK 26 support PR and publish a minor Theme Kit release (10.13.0
   if no other release has advanced the version). Follow the publishing process
   below, including all four release packages in dependency order.
2. Verify the registry tarballs for core and Next.js contain the SDK 26 peer
   range and rewritten workspace dependencies. Confirm a fresh consumer install
   with SDK 26.16.0 on Node.js 22 and run its build and tests.
3. Update the 24 blocked theme PRs to the published Theme Kit version, regenerate
   their lockfiles, and rerun their CI before resuming merges. Do not resume with
   Theme Kit 10.12.0 or bypass peer checks to unblock them.

Track release completion and the theme rollout in
[DEV-24508](https://linear.app/prezly/issue/DEV-24508).


## Publishing releases

Releases use the manually dispatched [Publish Theme Kit workflow](https://github.com/prezly/theme-kit-js/actions/workflows/publish.yml).
Local publishing through Lerna is retired. Keep account 2FA enabled: CI authenticates with npm trusted publishing (OIDC), without a personal npm token or an interactive OTP.

### One-time setup

1. Create the GitHub environment **`npm`** in `prezly/theme-kit-js`. Restrict deployment branches to **`main`**, and configure required reviewers if available. The workflow also restricts execution to that branch.
2. Merge `.github/workflows/publish.yml` through a reviewed PR before configuring npm. The workflow uses GitHub-hosted runners, Node 24, npm 11.15.0 (OIDC requires at least 11.5.1), and `id-token: write`. The publishing job has only `contents: read`. A separate follow-up job has `contents: write` to create the release Git tag and GitHub Release using GitHub’s built-in workflow token, after publishing and verification succeed. That job checks out the same commit and runs the tag and release helpers without installing dependencies or running builds or tests. No `NPM_TOKEN` or `NODE_AUTH_TOKEN` secret is required.
3. On npm, open each package's Settings → Trusted Publisher → GitHub Actions. Use organization **`prezly`**, repository **`theme-kit-js`**, workflow filename **`publish.yml`** (filename only), and environment **`npm`**. Enable **Allow npm publish**. Leave **Allow npm dist-tag** disabled; this workflow sets the tag when publishing and does not retag existing versions.
4. Configure all four packages: `@prezly/theme-kit-intl`, `@prezly/theme-kit-core`, `@prezly/theme-kit-react`, and `@prezly/theme-kit-nextjs`. Preserve unrelated existing trusted publishers. Create connections close to the approved first release: npm currently requires the first successful publish within two days, otherwise the connection expires and must be recreated.

See [npm trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/). The SDK workflow's permissions alone do not prove that its separate npm connection works.

### Prepare reviewed versions

Update `lerna.json` and the four workspace `package.json` versions together in a PR. Keep internal dependency declarations as `workspace:^`; pnpm rewrites them when packing. Exclude `packages/ui`.
Update the lockfile if the manifest changes require it, and include release notes in the PR. Do not use local release scripts to bump, commit, tag or push versions.
Versions are never changed by CI. A new release needs unpublished committed versions. `latest` rejects prerelease versions; use `next` for reviewed prereleases. Both channels publish only from `main`.

### Validate and publish

1. Merge the reviewed version and workflow changes into `main`.
2. Open Actions → Publish Theme Kit → Run workflow. Select `main`, choose `latest` or `next`, and leave **dry_run=true**.
3. Inspect all checks, the job summary, and the `npm-release-<commit>-<attempt>` artifact. Compatibility checks run in separate jobs, so their dependency overrides cannot affect release tarballs. The release job builds with the frozen lockfile, runs lint, type checks and tests, packs using `pnpm pack`, checks packed manifests and entry points, and installs the tarballs in a fresh consumer directory with CommonJS and ESM smoke tests. It rejects source changes made by build scripts.
4. A dry run validates all tarballs and reports existing versions without overwriting them. It runs `npm publish --dry-run` only for unpublished versions, because npm rejects existing versions even in dry-run mode. **Dry runs do not prove OIDC publishing authentication works.** If a version already exists with different bytes or a different channel tag, a real release will stop before publishing any package. Prepare a reviewed version bump first.
5. Obtain explicit release approval for the commit, versions and channel. Dispatch again with **dry_run=false** and the same channel, checking that the default-branch commit is the one approved. Approve the environment deployment if required. The real run repeats all checks and publishes the validated tarballs using `npm publish`.
6. The workflow verifies registry integrity and tags, then installs exact published versions in a fresh directory and checks CommonJS and ESM imports. Check this step before announcing success. After all four packages pass registry verification and installation checks, the workflow creates one annotated Git tag matching the shared version in `lerna.json` (for example, `v10.15.1`) at the workflow commit. It checks that intl, core, react and nextjs all match that version; `packages/ui` is excluded. It then creates a GitHub Release with generated release notes: `latest` marks it as the latest release, while `next` marks it as a prerelease. Dry runs create neither Git tags nor GitHub Releases.

One repository-wide concurrency group serializes both channels and retries, with `cancel-in-progress: false`. Do not cancel an active publish or run a separate publisher alongside it. GitHub may replace older pending runs; select the intended commit before dispatching again.

### Recovery

Publishing is ordered **intl → core → react → nextjs**, with registry verification between packages. `packages/ui` is never packed or published. npm publication is not atomic across packages.

1. Read the failing run's summary and retain its artifact, commit SHA and channel. Inspect registry versions before retrying; a network failure does not mean publishing failed.
2. Fix the npm trusted publisher mapping or environment setup if authentication failed. A connection must exactly match this repository, `publish.yml`, and `npm`. Do not add a personal token as a workaround.
3. Rerun **all jobs of the same workflow run**, keeping its original commit and channel. Previously published versions are skipped only when their SHA-512 integrity and selected dist-tag exactly match the rebuilt tarballs. All packages are preflighted before any publication. The remaining packages publish in dependency order. The registry verification step also checks skipped packages.
4. If rebuilt bytes differ, stop. Do not unpublish, overwrite, or bypass the comparison. Compare the retained artifact with the rebuild to diagnose the difference. Prepare a new reviewed coordinated version bump for all four packages and release it normally. Keep consumers on the previous complete release until the new set passes registry installation checks.
5. Before publishing, the workflow checks that the release Git tag is absent or points to the same commit. It never moves an existing Git tag. If tag or GitHub Release creation fails after npm publication, fix the GitHub permission, tag-rule or API issue and rerun all jobs of the same run: identical npm packages are skipped and Git tag and release creation are retried. Existing release titles and notes are preserved; only the release flags are updated. A conflicting Git tag stops both dry runs and real releases and must be investigated before retrying.

A different existing dist-tag also stops recovery. Retagging or promoting an existing `next` version needs a separately approved process and is not performed by this workflow.

For local checks after building, use `node .github/scripts/release.mjs pack latest` and `node .github/scripts/release.mjs dry-run latest`. These use no publishing credentials. Real publication is guarded to run only in the manual default-branch GitHub workflow. Artifacts are written to ignored `.release/`; npm installs use a temporary directory outside the workspace. Run `node --test .github/scripts/release-checks.mjs .github/scripts/release-tag-checks.mjs .github/scripts/github-release-checks.mjs` to test release safeguards without contacting npm or publishing.

----

Brought to you by [Prezly](https://www.prezly.com/?utm_source=github&utm_campaign=@prezly/theme-kit).

[Lerna]: https://lerna.js.org/
[Nx]: https://nx.dev/
