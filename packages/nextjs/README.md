# Next.js Prezly Theme Kit

![Version](https://img.shields.io/npm/v/@prezly/theme-kit-nextjs)
![License](https://img.shields.io/npm/l/@prezly/theme-kit-nextjs)

This library is a collection of data-fetching functions, hooks and utility functions to abstract some of the under-the-hood logic used by Prezly newsrooms and help developers create themes with [Next.js] much faster with little boilerplate required.

The package is built with [Typescript] on top of [Prezly SDK].

## Adding the library to your Next.js theme

### npm

```Shell
npm install --save @prezly/sdk @prezly/theme-kit-core @prezly/theme-kit-nextjs
```

#### peerDependencies

This library depends on `@prezly/theme-kit-core` package, which contains more helpers that are not specific to Next, as well as `@prezly/sdk`, which provides the communication with Prezly API and typings.
We will occasionally bump the minimum required SDK version to ensure compatibility with latest Prezly features.

This library is intended to be used with [Next.js] applications, so it also requires `next`, `react` and `react-dom` to work. These should already be installed if you have an existing [Next.js] app.
If you're starting from scratch, use [create-next-app] to quick-start the project.

To keep things fresh, we require at least Next.js 12 and React 17.

You can also install the dependencies manually
```Shell
npm install --save next react react-dom
npm install --save-dev @types/react @types/react-dom
```

### .env

Prezly themes use two ways of getting base environment variables:
- Getting variables straight from `.env` file
- Extracting variables from HTTP headers (when hosted on the Prezly infrastructure)

For local development, and for self-hosted themes, you can only use the former option. Add these variables to your `.env` file:
```
PREZLY_ACCESS_TOKEN=your access token
PREZLY_NEWSROOM_UUID=your newsroom UUID
PREZLY_THEME_UUID=your theme UUID
```

`PREZLY_THEME_UUID` variable is only reqiured for developing themes that are already hosted on Prezly infrastructure.
It determines which theme preset will be pulled from the API. For self-hosted themes, you'll want to handle the theme settings in some other way.

If you don't have these credentials, you can use one of our [testing newsrooms credentials](https://github.com/prezly/theme-nextjs-starter#testingtoken).

### next.config.js

In a base setup, you don't have to make any changes to your config.
Depending on your use-case, you might need to make some additions to your base config.

#### `withPrezlyConfig` helper

You can add all of the necessary properties to your Next config with a single helper function.
It adds the required `i18n` config, `images` config if you're using `next/image` to display images served from Prezly, and recommended security headers.
Apart from several properties in `i18n` config, all of your existing config properties will be preserved and merged with our custom properties.
You can control each of the config overrides with optional parameters object.

```js
const withPrezlyConfig = require('@prezly/theme-kit-nextjs/config')(/* Optional parameters for PrezlyConfig */);

const config ={
    /* ...your next config... */
};

module.exports = withPrezlyConfig(config);
```

You can also add the properties manually if you want even more control over the config.

#### Usage with `basePath` setting

When using `basePath` setting in your next.config.js, wrapping your config with `withPrezlyConfig` will automatically populate `NEXT_PUBLIC_BASE_PATH` env variable, which will be respected by Theme Kit helpers and hooks (like `useInfiniteStoriesLoading`). We also export `getResolvedPath` helper that can be used to resolve paths with respect to your `basePath` setting.

#### Using next/image to display images served from Prezly

We provide `@prezly/uploadcare-image` package to conveniently display images inside Prezly content, and this is the recommended way to display images in your theme.
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
const locales = require('@prezly/theme-kit-nextjs/localeConfig');

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

    // `newsroomContextProps` can be undefined, if there was error when fetching the newsroom props.
    // This can happen due to connection issues, or incorrect credentials in your .env file.
    // In this case, a 500 error page would be rendered, which shouldn't rely on the Newsroom Context (especially when statically generated).
    if(!newsroomContextProps) {
        return <Component {...customPageProps} />
    }

    return (
        <NewsroomContextProvider {...newsroomContextProps}>
            <Component {...customPageProps} />
        </NewsroomContextProvider>
    );
}

export default App;
```

### Page files (Server-side rendering)

Every page requires a bit of boilerplate code to set up.
Note that server-side code should be imported from `@prezly/theme-kit-nextjs/server`. That prevents the server code and dependencies from leaking into the client bundle.

```tsx
import { getNewsroomServerSideProps, processRequest } from '@prezly/theme-kit-nextjs/server';
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
This function fetches all the required base props and exposes the `ContentDelivery.Client` instance, which you can use to fetch additional content like stories or categories.

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

**Helpers for common pages**

To reduce boilerplate for common scenarios, the library provides a collection of prop fetching methods for each of the default Prezly Newsroom pages. All of them support custom props, so you can still have minimal boilerplate with all the same customization. If you have a more specific scenario, you can still use the code shown in the beginning of this section.

Here's an example of `getServerSideProps` function with no custom props:
```ts
import { getHomepageServerSideProps } from '@prezly/theme-kit-nextjs/server';

/* ...your page component */

export const getServerSideProps = getHomepageServerSideProps({});
```

And here's a more sophisticated scenario from Bea Theme, with extra options and custom props that depend on the Next request context and newsroom context props:
```ts
import { getHomepageServerSideProps, type HomePageProps } from '@prezly/theme-kit-nextjs';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { importMessages, isTrackingEnabled } from '@/utils';
import type { BasePageProps, StoryWithImage } from 'types';

const Stories = dynamic(() => import('@/modules/Stories'), { ssr: true });

type Props = BasePageProps & HomePageProps<StoryWithImage>;

const IndexPage: FunctionComponent<Props> = ({ stories, pagination }) => (
    <Stories stories={stories} pagination={pagination} />
);

export const getServerSideProps = getHomepageServerSideProps<BasePageProps, StoryWithImage>(
    async (context, { newsroomContextProps }) => ({
        isTrackingEnabled: isTrackingEnabled(context),
        translations: await importMessages(newsroomContextProps.localeCode),
    }),
    { extraStoryFields: ['thumbnail_image'] },
);

export default IndexPage;
```

You can find all of the helper methods in the [page-props](./tree/main/src/adapter-nextjs/page-props) directory. You can also refer to [Prezly Bea Theme](https://github.com/prezly/theme-nextjs-bea) for usage examples.

### SEO Helper components

This library provides two components: [PageSeo](./tree/main/src/components-nextjs/PageSeo) and [StorySeo](./tree/main/src/components-nextjs/StorySeo), both based on the [next-seo](https://github.com/garmeeh/next-seo) library. They consume information from the `NewsroomContext` and provide all the necessary tags for your pages, with correct social preview, as well as JsonLD and OpenGraph data for your stories. You can also override the parameters for `PageSeo` component, these will be passed straight to `NextSeo` component. See the JSDoc comments on the exported components to get instructions on their usage.

### Auto-generated Sitemap

This kit can also help you with building your Sitemap automatically. Here's what you need to get started:

1. Create a sitemap page file: `/pages/sitemap.xml.ts`
2. Use this code to display the default Sitemap built with your Newsroom stories:
```ts
import { getSitemapServerSideProps } from '@prezly/theme-kit-nextjs/server';
import type { NextPage } from 'next';

const Sitemap: NextPage = () => null;

export const getServerSideProps = getSitemapServerSideProps();

export default Sitemap;
```

You can also add additional paths to the sitemap by passing them as an argument to `getSitemapServerSideProps`, like so:
```ts
const additionalPaths = ['/my-custom-path'];

export const getServerSideProps = getSitemapServerSideProps({ additionalPaths });
```

If you need a more customized approach, you can build your own Sitemap by extending the `SitemapBuilder` class exported from the library, as well as referring to the code in the [Sitemap](./tree/main/src/adapter-nextjs/page-props/sitemap) component directory.

### Experimental: Static Site Generation

For self-hosted applications, we now provide an option to use SSG in your project. However, this comes with some limitations:

- Multi-langugage is not yet supported. Make sure to remove the `i18n` property from your `next.config.js`.
- Sitemap will still use SSR to set the XML Content-Type headers on the response.
- Story preview page needs to use SSR to ensure that content is always up to date.

The workflow is pretty much the same as with our default SSR approach. You will need to use the new `getNewsroomStaticProps` and `processStaticRequest` methods. Note that `getNewsroomStaticProps` returns its props in the `staticProps` property. The data is still the same as in the SSR methods, so apart from multi-language, this should be a drop-in replacement for your pages.
```tsx
import { getNewsroomStaticProps, processStaticRequest } from '@prezly/theme-kit-nextjs/server';
import type { GetStaticProps } from 'next';

/* Your Page component code */

export const getStaticProps: GetServerSideProps<Props> = async (context) => {
    const { api, staticProps } = await getNewsroomStaticProps(context);

    /* Your logic to get additional props for this page  */

    return processStaticRequest(
        context,
        {
            ...serverSideProps,
            myProp: 'My Custom Prop',
        },
    );
};
```

We also have added all of the page helpers (except Story Preview) for SSG prop fetching. Here's an example for the Home page:
```ts
import { getHomepageStaticProps } from '@prezly/theme-kit-nextjs/server';

/* ...your page component */

export const getStaticProps = getHomepageStaticProps({});
```


For dynamic pages, like `/story/[slug]`, we also provide `getStaticPaths` helper functions:
```tsx
import { getStoryPageStaticPaths, getStoryPageStaticProps } from '@prezly/theme-kit-nextjs/server';

/* Your Page component code */

export const getStaticProps = getStoryPageStaticProps({});

export const getStaticPaths = getStoryPageStaticPaths;
```

These are available for `/category/[slug]`, `/story/[slug]` and `/media/album/[uuid]` pages.

You can find all of the helper methods in the [page-props](./tree/main/src/adapter-nextjs/page-props) directory.

----

## Contributing
Please see our [CONTRIBUTING.md](CONTRIBUTING.md).

----

## What's next

This kit is just a collection of building blocks, so it doesn't really force any page structure or guidelines on how to render the content.
You can learn more on how this kit can be used by checking the code of Prezly's themes:
- [Prezly Starter Theme](https://github.com/prezly/theme-nextjs-starter) - this is a bare-bones application created to demonstrate how to display the fetched content and recommended page structure
- [Prezly Bea Theme](https://github.com/prezly/theme-nextjs-bea) - this is our new fully-fledged theme available to all Prezly customers. It has lots of stuff on top, both in styling and in data logic.

You can also learn more about Prezly API by checking out typings in [Prezly SDK] package, and referring to the [Prezly API Docs]

----

Brought to you by [Prezly](https://www.prezly.com/?utm_source=github&utm_campaign=@prezly/theme-kit-nextjs).

[create-next-app]: https://nextjs.org/docs/api-reference/create-next-app
[Next.js]: https://nextjs.org
[Prezly SDK]: https://www.npmjs.com/package/@prezly/sdk
[Prezly API Docs]: https://developers.prezly.com/docs/api
[Typescript]: https://www.typescriptlang.org


## Sharing cached content requests

When `PrezlyAdapter.connect` has a memory or Redis cache enabled, concurrent
`contentDelivery` calls for the same data share one pending operation across
adapter instances in the same JavaScript runtime. Completed operations leave the
pending registry when their cache write settles or after one second, whichever
comes first. Successful responses are delivered immediately, and later write
failures are observed. A custom cache whose write never settles cannot retain a
completed result or its pending slot indefinitely. Failed requests can be retried
by a later request. This is not a lock shared across pods or workers.

The sharing identity includes the API base URL, access token, custom headers,
cache configuration, newsroom, theme, content formats, serialized method
arguments, and cache invalidation version. Credentials are hashed before they
enter that identity. Cached values also carry the source/authorization hash so
a different token or API cannot consume a previous identity's warm value.

A custom `fetch` can depend on context the adapter cannot see. It keeps
client-local sharing unless you provide `cache.requestScope`, a stable string
that identifies all additional context affecting its responses. Do not opt in
with a constant scope if that context varies between requests. For direct
`ContentDelivery.createClient` usage, the equivalent opt-in is `cache.scope`;
that caller must include its source, authorization and storage identity because
an arbitrary SDK client does not expose them.

Cached content requests have these per-runtime limits:

| Resource | Limit |
| --- | --- |
| Distinct pending content operations | 1,024 (existing followers still share) |
| Completed-result retention while its cache write is pending | At most 1 second |
| Active content API HTTP requests | 32 |
| Pages produced concurrently by one `allStories` operation | 8 |
| Queued content API HTTP requests | 256 |
| Queue wait | 1 second |
| Each API HTTP request, including body consumption | 30 seconds |
| Each Redis command wait | 1 second |
| Outstanding Redis commands per connection | 128 |
| Redis connection attempt | 1 second |

Exceeding admission or API deadlines rejects the content call. Redis connection,
read, and write failures fall back to the bounded API path. Disconnected Redis
clients do not queue commands, and requests do not wait for reconnection. No
additional API retries are introduced. The SDK returned as `client` retains its
existing behavior; these limits apply to the cached `contentDelivery` path.
Custom fetch implementations should honor `AbortSignal`: an implementation that
ignores cancellation retains its active slot until it actually settles.

The source-tagged values use one fixed `scoped-v1` namespace, rather than adding
new retained key namespaces for every token or invalidation version. This creates
a one-time cold cache on upgrade. Roll out gradually and warm representative
newsrooms before an expected traffic spike. Existing unscoped entries remain
subject to their configured expiration; do not flush a Redis instance that also
contains routing data. TTL and query canonicalization are separate policies and
are unchanged here.

### Memory layer refill and bounds

With both `memory` and `redis` enabled the layers form a stack. A hit found in
Redis is written back into the in-process layer with the entry's own version
and retention, so the next request on that runtime is served from memory
without a Redis round trip or a JSON decode. Before this, a memory entry lost to
a version change was never refilled and every later read on that pod went to
Redis. Stale entries are never copied: only a value that passed the version
check is written back, and a not-found entry keeps its short retention. Only
layers that implement the optional `lookup` method are refill sources; a
third-party `Cache` that implements `get` alone is read as before and never
copied from.

The in-process store is one `Map` per runtime shared by every adapter and
namespace, bounded to 128 MiB of estimated payload and 20,000 entries by
default. It evicts the least recently used entry first, deterministically and
without sorting; a read moves the entry to the most recent position. Pass
`memory: { maxBytes, maxRecords }` to `PrezlyAdapter.connect` to change the
bounds; both must be positive integers. `ContentDelivery.inspectSharedMemoryCache()`
reports the current occupancy.

Redis renewal changed at the same time. Regular content keeps a sliding
expiry, but instead of an `EXPIRE` on every read, an entry is rewritten with a
fresh timestamp only once it has consumed half of its lifetime, so a hot key
costs one write per half-life instead of one per read. The rewrite runs as a
small Lua script that compares the stored payload with the one that was read,
so a renewal landing after another pod refreshed the key never puts the older
payload back. Entries written by older releases carry no timestamp and are
renewed on their first read. The renewal still reports as the `expire` command
in telemetry. Not-found entries are never renewed.

The in-process store also refuses two kinds of write: an entry older than the
one it already holds for that key (a refill that lost a race with an origin
fetch) and an entry larger than `maxBytes` on its own, which would otherwise
evict every other tenant and still not fit.

### Not-found results

`contentDelivery.story()` and `contentDelivery.gallery()` resolve `null` when the
API answers 403, 404 or 410. A `null` result is a cache hit like any other value:
only an absent entry falls back to the API, so `false` and `0` are also valid
cached values. Not-found entries are kept for `negativeTtl` seconds (default 60,
`ContentDelivery.DEFAULT_NEGATIVE_TTL`). The deadline is written into the cached
envelope and checked on every read, so a cache layer that ignores the `ttl`
hint, or a `null` entry written by an older Theme Kit, is a miss rather than a
stale hit. Memory and Redis also expire these entries on their own, and Redis
does not renew that lifetime on read. A cache version change still invalidates
them at once, so publishing a story makes it visible immediately; a story that
becomes available without a version change appears within the TTL. Errors such
as 401, 429, 5xx and transport failures throw and are never stored. `undefined`
results are not stored either.

Set `cache.negativeTtl` in `PrezlyAdapter.connect` to change the retention. It
must be a positive integer number of seconds. Not-found caching needs the
source/authorization scope described above; a client created with a custom
`fetch` and no `requestScope` keeps treating `null` as a miss and does not
store it.

### Verification and release

Run the normal package build and tests with Node 20 and the repository's pnpm
version. The optional `pnpm --filter @prezly/theme-kit-nextjs test:redis` check
requires `redis-server` on PATH and built packages. It creates an isolated local
Redis process with persistence disabled and exercises cold/warm bursts, stalled
commands, reconnects, invalidation and cache-outage fallback. It does not use a
configured application Redis URL.

Release the changed core and Next.js packages together through the existing
Lerna workflow, with Next.js depending on the newly released core. Then update
Bea to that published version and verify its build before deployment. A merged
Theme Kit PR alone does not change a deployed newsroom. For pre-release
validation, install locally packed core and Next.js packages in an isolated Bea
checkout; do not commit a dependency on a version that has not been published.
