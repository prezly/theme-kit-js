# Prezly JavaScript Theme Kit

This is a monorepo for Prezly JavaScript Theme Kit packages.

See individual package READMEs for more information:

- [@prezly/theme-kit-nextjs](./packages/theme-kit-nextjs#readme)



## Working with the repo locally

### Getting started

After pulling the repo, run `npm i` to install the dependencies. This will install the root dependencies, as well as dependencies for individual packages.

The repo is designed to run all of the scripts from the root directory. This will simultaneously run the corresponding tasks on each repository. If you don't want this, you can `cd` into the package directory and run its own scripts.

### Publishing new releases

To keep versions in sync, releasing new packages should only be done from the root directory.

To publish a production version, run `npm run release`. Make sure you're on the `main` branch and don't have any uncommitted files before running the command. After the script finishes, a new GitHub release draft will open in your browser. Please make sure to fill it in a similar manner to previous releases (hitting "Auto-generate release notes" usually produces a nicer output than Lerna's default).

To publish a preview version (e.g. for testing), run `npm run release:preview`. This command can be executed on any branch, but you still need to have no uncommitted files. Please make sure to use a pre-release version to not conflict with production versions.

----

Brought to you by [Prezly](https://www.prezly.com/?utm_source=github&utm_campaign=@prezly/theme-kit).
