# Prezly JavaScript Theme Kit

This is a monorepo for Prezly JavaScript Theme Kit packages.

See individual package READMEs for more information:

- [@prezly/theme-kit-core](./packages/core#readme)
- [@prezly/theme-kit-nextjs](./packages/nextjs#readme)



## Working with the repo locally

### Getting started

After pulling the repo, run `npm i` to install the dependencies. This will install the root dependencies, as well as dependencies for individual packages.

The repo is designed to run all of the scripts from the root directory with the help of [Lerna] and [Nx].
This ensures that all tasks are aware of dependencies between packages. Nx also provides caching, which speeds up the repeated tasks.
You can learn more about task pipeline configuration from [Lerna docs](https://lerna.js.org/docs/concepts/task-pipeline-configuration).

For convenient development of individual packages, you have the `dev:` npm scripts. Each script will start the selected package in watch mode. Changes to both the package and its dependencies will result in a new build, so you only need to run a single script when working on packages.

### Publishing new releases

To keep versions in sync, releasing new packages should only be done from the root directory.

To publish a production version, run `npm run release`. Make sure you're on the `main` branch and don't have any uncommitted files before running the command. After the script finishes, a new GitHub release draft will open in your browser. Please make sure to fill it in a similar manner to previous releases (hitting "Auto-generate release notes" usually produces a nicer output than Lerna's default).

To publish a preview version (e.g. for testing), run `npm run release:preview`. This command can be executed on any branch, but you still need to have no uncommitted files. Please make sure to use a pre-release version to not conflict with production versions.

----

Brought to you by [Prezly](https://www.prezly.com/?utm_source=github&utm_campaign=@prezly/theme-kit).

[Lerna]: https://lerna.js.org/
[Nx]: https://nx.dev/