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
The existing SDK `21.12.0` and `23.x` peer ranges remain supported. Development
and CI use Node.js 22 so that all supported SDK versions can be tested.

### DEV-24508 release order

The theme PRs using Theme Kit 10.12.0 and SDK 26.16.0 must wait for the SDK 26
compatibility release. Version 10.12.0 excludes SDK 26 from its peer range.

1. Merge the SDK 26 support PR and publish a minor Theme Kit release (10.13.0
   if no other release has advanced the version). Follow the publishing process
   below, including every package Lerna lists as changed and publishing core
   before Next.js.
2. Verify the registry tarballs for core and Next.js contain the SDK 26 peer
   range and rewritten workspace dependencies. Confirm a fresh consumer install
   with SDK 26.16.0 on Node.js 22 and run its build and tests.
3. Update the 24 blocked theme PRs to the published Theme Kit version, regenerate
   their lockfiles, and rerun their CI before resuming merges. Do not resume with
   Theme Kit 10.12.0 or bypass peer checks to unblock them.

Track release completion and the theme rollout in
[DEV-24508](https://linear.app/prezly/issue/DEV-24508).

### Publishing new releases

## Before you publish

* Make sure that `@prezly/sdk` peer dependency on all packages is updated to the earliest supported version. This should usually match the version in root `devDependencies`.
* Make sure that SDK version matrix in GitHub workflows is matching the `@prezly/sdk` peer dependency version range

## Publishing a new version

To keep versions in sync, releasing new packages should only be done from the root directory.

To publish a production version, run `pnpm release`. Make sure you're on the `main` branch and don't have any uncommitted files before running the command. After the script finishes, a new GitHub release draft will open in your browser. Please make sure to fill it in a similar manner to previous releases (hitting "Auto-generate release notes" usually produces a nicer output than Lerna's default).

### Publishing with a hardware security key

`lerna publish` can only take a six-digit one-time password, so an npm account whose second factor is a hardware key stops at the OTP prompt after it has already committed, tagged and pushed the version. Do not fall back to `npm publish` inside a package directory: npm does not rewrite pnpm's `workspace:^` dependency specifiers, and the published package cannot be installed (this happened with 10.10.0). Build the tarballs with pnpm, which rewrites them, and publish the tarballs with npm, which supports the browser-based key flow:

```sh
pnpm exec lerna version minor --no-private   # commits, tags and pushes; answer the prompts
cd packages/core && pnpm pack --pack-destination /tmp/release
cd ../nextjs && pnpm pack --pack-destination /tmp/release
grep -c 'workspace:' /tmp/release/*/package.json 2>/dev/null   # must be empty
npm publish /tmp/release/prezly-theme-kit-core-<version>.tgz
npm publish /tmp/release/prezly-theme-kit-nextjs-<version>.tgz
```

Publish core before Next.js. Include every package Lerna listed as changed.

To publish a preview version (e.g. for testing), run `pnpm release:preview`. This command can be executed on any branch, but you still need to have no uncommitted files. Please make sure to use a pre-release version to not conflict with production versions.

----

Brought to you by [Prezly](https://www.prezly.com/?utm_source=github&utm_campaign=@prezly/theme-kit).

[Lerna]: https://lerna.js.org/
[Nx]: https://nx.dev/
