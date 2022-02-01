# NextJS Prezly Theme Kit

![Version](https://img.shields.io/npm/v/@prezly/theme-kit-nextjs)
![License](https://img.shields.io/npm/l/@prezly/theme-kit-nextjs)

This library is a collection of data-fetching functions, hooks and utility functions to abstract some of the under-the-hood logic used by Prezly newsrooms and help developers create themes with [Next.JS] much faster with little boilerplate required.

The package is built with [Typescript] on top of [Prezly SDK].

## Adding the library to your NextJS theme

### npm

```Shell
npm install --save @prezly/theme-kit-nextjs
```

#### peerDependencies

This library is intended to be used with [Next.JS] applications, so it requires `next`, `react` and `react-dom` to work. These should already be installed if you have an existing NextJS app. 
If you're starting from scratch, use [create-next-app] to quick-start the project.

To keep things fresh, we require at least NextJS 12 and React 17.

You can also install the dependencies manually
```Shell
npm install --save next react react-dom
npm install --save-dev @types/react @types/react-dom
```

### .env

Prezly themes use two ways of getting base environment variables:
- Getting variables straight from `.env` file
- Extracting variables from HTTP headers (when hosted on the Prezly infrastructure)

For local development, and for self-hosted themes, you can only use the former option. Add these two variables to your `.env` file:
```
PREZLY_ACCESS_TOKEN=your access token
PREZLY_NEWSROOM_UUID=your newsroom UUID
```

If you don't have these credentials, you can use one of our [testing newsrooms credentials](https://github.com/prezly/theme-nextjs-starter#testingtoken).

### next.config.js

In a base setup, you don't have to make any changes to your config.
Depending on your use-case, you might need to make some additions to your base config.

#### Using next/image to display images served from Prezly

We provide `@prezly/uploadcare-image` package to conviniently display images inside Prezly content, and this is the recommended way to display images in your theme.
However, if you need to use the default `next/image` component, you will need to add our CDN url to image domains settings:
```js
module.exports = {
    /* ...your next config... */
    images: {
        domains: ['cdn.uc.assets.prezly.com'],
    },
};
```

#### Multi-language support

If you want to support multi-language in your theme, you'll need to make additional changes to the file:

```js
const { DUMMY_DEFAULT_LOCALE } = require('@prezly/theme-kit-nextjs');
const locales = require('@prezly/theme-kit-nextjs/build/intl/localeConfig');

module.exports = {
    /* ...your next config... */
    
    i18n: {
        // These are all the locales you want to support in
        // your application
        locales: [...locales, DUMMY_DEFAULT_LOCALE],
        // This is the default locale you want to be used when visiting
        // a non-locale prefixed path e.g. `/media`
        // We use Pseudo locale used for localization testing, to reliably determine if we need to fallback to the default newsroom language
        defaultLocale: DUMMY_DEFAULT_LOCALE,
        // Default locale detection is disabled, since the locales would be determined by Prezly API
        localeDetection: false,
    },
};
```

### pages/_app.tsx

In order to provide all the necessary data to the entire application, this library exports the `NewsroomContextProvider` component, which accepts props retrieved by our data-fetching methods (see next section). These props contain data that would be required to display common components like navigation, language picker, boilerplate, etc.

```tsx
import { NewsroomContextProvider, PageProps } from '@prezly/theme-kit-nextjs';
import type { AppProps } from 'next/app';

type AnyPageProps = Record<string, any>;

function App({ Component, pageProps }: AppProps<AnyPageProps>) {
    const { newsroomContextProps, ...customPageProps } = pageProps as PageProps & AnyPageProps;

    // eslint-disable react/jsx-props-no-spreading
    return (
        <NewsroomContextProvider {...newsroomContextProps}>
            <Component {...customPageProps} />
        </NewsroomContextProvider>
    );
    // eslint-enable react/jsx-props-no-spreading
}

export default App;
```

### Page files (Server-side rendering)

Every page requires a bit of boilerplate code to set up.

```tsx
import { getNewsroomServerSideProps, processRequest } from '@prezly/theme-kit-nextjs';
import type { GetServerSideProps } from 'next';
import type { FunctionComponent } from 'react';

interface Props {
    myProp: string;
}

const Page: FunctionComponent<Props> = ({ myProp }) => <p>{myProp}</p>;

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const { api, serverSideProps } = await getNewsroomServerSideProps(context);

    /* Your logic to get additional props for this page  */

    return processRequest(
        context,
        {
            ...serverSideProps,
            myProp: 'My Custom Prop',
        },
        '/',
    );
};

export default Page;
```

**Page display component**
```tsx
const Page: FunctionComponent<Props> = ({ myProp }) => <p>{myProp}</p>;
```
Since all of the common data is loaded into the `NewsroomContextProvider`, you don't need to handle any of those in your display components. So the Page component should just handle rendering the provided data. You can still use context hooks to access the newsroom data.

**Data fetching**
```ts
const { api, serverSideProps } = await getNewsroomServerSideProps(context);
```
This function fetches all the required base props and exposes the `PrezlyApi` instance, which you can use to fetch additional content like stories or categories.

```ts
return processRequest(
    context,
    {
        ...serverSideProps,
        myProp: 'My Custom Prop',
    },
    '/',
);
```
This function returns the combined base props and your additional props, with some extra logic in between to handle locale URLs.

The third argument is needed to properly handle locale redirects. It should contain the URL for the current page without locale prefixes (like `/`, `/media`, `/category/${category.slug}`. If omitted, the redirect logic will not be executing.

----

## What's next

This kit is just a collection of building blocks, so it doesn't really force any page structure or guidelines on how to render the content.
You can learn more on how this kit can be used by checking the code of Prezly's themes:
- [Theme Starter](https://github.com/prezly/theme-nextjs-starter) - this is a bare-bones application created to demonstrate how to display the fetched content and recommended page structure
- [Bea Theme](https://github.com/prezly/theme-nextjs-bea) - this is our new fully-fledged theme available to all Prezly customers. It has lots of stuff on top, both in styling and in data logic.

You can also learn more about Prezly API by checking out typings in [Prezly SDK] package, and referring to the [Prezly API Docs]

----

Brought to you by [Prezly](https://www.prezly.com/?utm_source=github&utm_campaign=@prezly/theme-kit-nextjs).

[create-next-app]: https://nextjs.org/docs/api-reference/create-next-app
[Next.JS]: https://nextjs.org
[Prezly SDK]: https://www.npmjs.com/package/@prezly/sdk
[Prezly API Docs]: https://developers.prezly.com/docs/api
[Typescript]: https://www.typescriptlang.org
[Prezly Content React Renderer]: https://www.npmjs.com/package/@prezly/content-renderer-react-js
