# Prezly JavaScript Theme Kit

This is a monorepo for Prezly JavaScript Theme Kit packages.

See individual package READMEs for more information:

- [@prezly/theme-kit-core](./packages/core#readme)
- [@prezly/theme-kit-nextjs](./packages/nextjs#readme)
- [@prezly/theme-kit-ui](./packages/ui#readme)

## Working with the repo locally

### Getting started

After pulling the repo, run `npm i` to install the dependencies. This will install the root dependencies, as well as dependencies for individual packages.

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

### Publishing new releases

## Before you publish

* Make sure that `@prezly/sdk` peer dependency on all packages is updated to the earliest supported version. This should usually match the version in root `devDependencies`.
* Make sure that SDK version matrix in GitHub workflows is matching the `@prezly/sdk` peer dependency version range

## Publishing a new version

To keep versions in sync, releasing new packages should only be done from the root directory.

To publish a production version, run `npm run release`. Make sure you're on the `main` branch and don't have any uncommitted files before running the command. After the script finishes, a new GitHub release draft will open in your browser. Please make sure to fill it in a similar manner to previous releases (hitting "Auto-generate release notes" usually produces a nicer output than Lerna's default).

To publish a preview version (e.g. for testing), run `npm run release:preview`. This command can be executed on any branch, but you still need to have no uncommitted files. Please make sure to use a pre-release version to not conflict with production versions.

----

Brought to you by [Prezly](https://www.prezly.com/?utm_source=github&utm_campaign=@prezly/theme-kit).

[Lerna]: https://lerna.js.org/
[Nx]: https://nx.dev/