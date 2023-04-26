import { getShortestLocaleCode, LocaleObject } from '@prezly/theme-kit-core';
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { getRedirectToCanonicalLocale } from '../intl/index.js';
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
    const { locale: nextLocale, query } = context;

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
