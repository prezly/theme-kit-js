# Prezly JavaScript Theme Kit

This is a monorepo for Prezly JavaScript Theme Kit packages.

See individual package READMEs for more information:

- [@prezly/theme-kit-core](./packages/core#readme)
- [@prezly/theme-kit-nextjs](./packages/nextjs#readme)


## Working with the repo locally

### Getting started

After pulling the repo, run `pnpm install` to install the dependencies. This will install the root dependencies, as well as dependencies for individual packages.

If you don't pnpm installed, install it with the following command globally:

```
npm i pnpm -g
```

### Scripts

The repo is designed to run all of the scripts from the root directory with the help of [Lerna] and [Turbo].
This ensures that all tasks are aware of dependencies between packages. Turbo also provides caching, which speeds up the repeated tasks.
You can learn more about task pipeline configuration from [Lerna docs](https://lerna.js.org/docs/concepts/task-pipeline-configuration).

You can start developing packages and watch for changes simultaneously using `watch` command. Changes to both the package and its dependencies will result in a new build.

Below is an overview of the scripts defined in the `scripts` section of the `package.json` file. The table lists each command along with a brief description of its functionality. These scripts can be executed using package managers such as npm or pnpm in the project's root folder.


| Command                   | Description                                                                                         |
|---------------------------|-----------------------------------------------------------------------------------------------------|
| `build`                   | Runs the production build of the project.                                                           |
| `build:dev`               | Runs the development build of the project.                                                          |
| `watch`                   | Starts a development scripts that compiles ts files and watches for file changes.                   |
| `lint`                    | Runs linting on the project's source code.                                                          |
| `lint:fix`                | Runs linting on the project's source code and automatically fixes any fixable issues.               |
| `prettier`                | Checks the project's source code for formatting consistency using Prettier.                         |
| `prettier:fix`            | Formats the project's source code using Prettier.                                                   |
| `test`                    | Runs tests for the project.                                                                         |
| `typecheck`               | Checks the project's TypeScript types.                                                              |
| `check`                   | Runs linting, type checking, and tests for the project.                                             |
| `release`                 | Prepares and publishes a new release of the project.                                                |
| `release:preview`         | Prepares and publishes a preview release of the project.                                            |
| `release:build`           | Forces a build of the project for the release.                                                      |
| `release:prepare`         | Cleans the project, installs dependencies, builds the project, and performs a check before release. |
| `release:publish`         | Publishes a new release using Lerna.                                                                |
| `release:publish:preview` | Publishes a preview release using Lerna with a prerelease tag.                                      |
| `clean`                   | Cleans the project's build files and `node_modules` directories.                                    |
| `clean:build`             | Removes build-related files and directories.                                                        |
| `clean:node_modules`      | Removes the `node_modules` directory and associated lock files.                                     |

### Prezly SDK dependency

We aim to support the broadest range of Prezly SDK version.<br/>
One of the ways to achieve that is by using the smallest subset of SDK entity fields as possible. This is mainly reflected in the types, which are using `Pick<Type, ...>`, rather than a full `Type`. Please aim to only require properties that are actually needed in the helpers.

Prezly SDK has a tendency to introduce major releases that are not necessary breaking the Theme Kit or Theme applications. In order to ensure safety of operation, we specify the upper boundary of SDK version. If there's a new major SDK release that doesn't break Theme Kit functionality, you can safely release a minor Theme Kit version with increased version range to support that SDK version.

GitHub Actions are set up with a version matrix to ensure compatibility with all currently supported versions. Please keep the matrix in sync with the peer dependency version range.

## Publishing new releases

### Before you publish

* Make sure that `@prezly/sdk` peer dependency on all packages is updated to the earliest supported version. This should usually match the version in root `devDependencies`.
* Make sure that SDK version matrix in GitHub workflows is matching the `@prezly/sdk` peer dependency version range

### Publishing a new version

To keep versions in sync, releasing new packages should only be done from the root directory.

To publish a production version, run `pnpm release`. Make sure you're on the `main` branch and don't have any uncommitted files before running the command. After the script finishes, a new GitHub release draft will open in your browser. Please make sure to fill it in a similar manner to previous releases (hitting "Auto-generate release notes" usually produces a nicer output than Lerna's default).

To publish a preview version (e.g. for testing), run `pnpm release:preview`. This command can be executed on any branch, but you still need to have no uncommitted files. Please make sure to use a pre-release version to not conflict with production versions.

----

Brought to you by [Prezly](https://www.prezly.com/?utm_source=github&utm_campaign=@prezly/theme-kit).

[Lerna]: https://lerna.js.org/
[Turbo]: https://turbo.build/