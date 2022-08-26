# Contributing to @prezly/theme-kit-nextjs

First off, thanks for taking the time to contribute! 🎉

Assuming you have cloned the repo and installed dependencies on your machine, the very next step is to develop the package.

Since theme-kit provides a collection of base functions, hooks, and utilities that work with [Prezly themes](https://github.com/prezly?q=theme-nextjs&type=all&language=&sort=) under the hood, in order to make changes and test things out on your side, you're gonna need to keep a theme running in parallel with the theme-kit.

So if you haven't already, go ahead and follow the [instructions on Bea theme](https://github.com/prezly/theme-nextjs-bea#quick-start) to get it up and running.

As you can already see in the theme's `package.json` file, we're using `@prezly/theme-kit-nextjs` package. So we need to make sure that our theme is using our local version of theme-kit and not the one's in the theme's `node_modules` folder. How do we achieve that?

There's this awesome package called [yalc](https://github.com/wclr/yalc), which serves the purpose for our use case! So let's install it:

```
npm i yalc -g
```

Or if you're using yarn:

```
yarn global add yalc
```

The `yalc` package maintains its own local "store", at `~/.yalc`. Publish a package with yalc, and a full copy of the package is copied to the store. Install a package from the yalc store, and the project will install that copy much like it would install a package from an external registry. Update a package published to the yalc store, and the update is now available in the dependent projects; you can even publish and automatically update dependent projects with a single command.

Go back to **theme-kit's project root** folder and run:

```
yalc publish
```

This will publish the package in the yalc's local store, then go back to your **theme's project root**, and run the following commands:

```bash
npm uninstall -S @prezly/theme-kit-nextjs
yalc add @prezly/theme-kit-nextjs
npm install
```

What did we do? We simply removed the theme's `@prezly/theme-kit-nextjs` package in `node_modules` and told our theme to use the local version of the package on our file system!

Now the fun part begins, go ahead and hack the package (Make changes) :) Once you're done, simply run the following in **theme-kit's project root** folder:

```bash
yalc push
```

It acts like you have released a new version of your package that your theme can use.
And don't forget to run `npm install` in the theme's folder _if you have changed dependencies_ for the **theme-kit**.

If the changes are not automatically picked up by theme's dev server, restart the **theme's dev server**.
