# JavaScript Prezly Theme Kit

![Version](https://img.shields.io/npm/v/@prezly/theme-kit-core)
![License](https://img.shields.io/npm/l/@prezly/theme-kit-core)

This library is a collection of data-fetching and utility functions to abstract some of the under-the-hood logic used by Prezly sites and help developers create themes with JavaScript much faster.

The package is built with [Typescript] on top of [Prezly SDK].

## Adding the library to your theme

### npm

```Shell
npm install --save @prezly/theme-kit-core
```

### .env

Prezly themes use two ways of getting base environment variables:
- Getting variables straight from `.env` file
- Extracting variables from HTTP headers (when hosted on the Prezly infrastructure)

For local development, and for self-hosted themes, you can only use the former option. Add these variables to your `.env` file:
```
PREZLY_ACCESS_TOKEN=your access token
PREZLY_NEWSROOM_UUID=your site UUID
PREZLY_THEME_UUID=your theme UUID
```

`PREZLY_THEME_UUID` variable is only reqiured for developing themes that are already hosted on Prezly infrastructure.
It determines which theme preset will be pulled from the API. For self-hosted themes, you'll want to handle the theme settings in some other way.

If you don't have these credentials, you can use one of our [testing sites credentials](https://github.com/prezly/theme-nextjs-starter#testingtoken).

----

## What's next

This kit is just a collection of building blocks, so it doesn't really force any page structure or guidelines on how to render the content.
You can learn more on how this kit can be used by checking the code of Prezly's themes:
- [Prezly Starter Theme](https://github.com/prezly/theme-nextjs-starter) - this is a bare-bones application created to demonstrate how to display the fetched content and recommended page structure
- [Prezly Bea Theme](https://github.com/prezly/theme-nextjs-bea) - this is our new fully-fledged theme available to all Prezly customers. It has lots of stuff on top, both in styling and in data logic.

You can also learn more about Prezly API by checking out typings in [Prezly SDK] package, and referring to the [Prezly API Docs]

----

Brought to you by [Prezly](https://www.prezly.com/?utm_source=github&utm_campaign=@prezly/theme-kit-js).

[Prezly SDK]: https://www.npmjs.com/package/@prezly/sdk
[Prezly API Docs]: https://developers.prezly.com/docs/api
[Typescript]: https://www.typescriptlang.org
