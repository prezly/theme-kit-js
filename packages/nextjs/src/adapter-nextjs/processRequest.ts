import { assertServerEnv, getShortestLocaleCode, LocaleObject } from '@prezly/theme-kit-core';
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { getRedirectToCanonicalLocale } from '../intl';
import type { PageProps, ServerSidePageProps } from '../types';

/**
 * This function combines the props returned from `getNewsroomServerSideProps` and your optional custom props for the page.
 * It also handles locale redirects, if `canonicalUrl` parameter is provided.
 * See README for usage examples.
 *
 * @param context Next.js context passed to the `getServerSideProps` method of the page
 * @param props Object containing the return of `getNewsroomServerSideProps` and your optional custom props.
 * @param canonicalUrl Optional: a canonical URL for the current page without locale part. If provided, locale redirects will be handled by the function.
 */
export function processRequest<Props>(
    context: GetServerSidePropsContext,
    props: Props & PageProps & ServerSidePageProps,
    canonicalUrl?: string,
): GetServerSidePropsResult<Props> {
    assertServerEnv('processRequest');
    const { locale: nextLocale, query, res } = context;

    // Since Next 13, Cache-Control header set in `next.config.js` is overwritten by Next in production, effectively bypassing any caching systems setup on top of the theme.
    // This is a workaround for that issue. See https://nextjs.org/docs/pages/building-your-application/deploying/production-checklist#caching
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');

    const { localeResolved, ...pageProps } = props;

    // If no locale was provided by Next, it most likely means that the theme is not supporting multi-language.
    // In that case we won't show 404 page.
    if (!localeResolved && nextLocale) {
        return { notFound: true };
    }

    if (canonicalUrl) {
        const { languages, localeCode } = pageProps.newsroomContextProps;
        const currentLocale = LocaleObject.fromAnyCode(localeCode);
        const shortestLocaleCode = getShortestLocaleCode(languages, currentLocale);

        const redirect = getRedirectToCanonicalLocale(
            shortestLocaleCode,
            nextLocale,
            canonicalUrl,
            query,
        );
        if (redirect) {
            return { redirect };
        }
    }

    return {
        props: pageProps as Props & PageProps,
    };
}
