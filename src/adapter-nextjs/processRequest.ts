import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { getShortestLocaleCode } from '../data-fetching';
import { getRedirectToCanonicalLocale, LocaleObject } from '../intl';
import type { PageProps, ServerSidePageProps } from '../types';

export function processRequest<Props>(
    context: GetServerSidePropsContext,
    props: Props & PageProps & ServerSidePageProps,
    canonicalUrl?: string,
): GetServerSidePropsResult<Props> {
    const { locale: nextLocale, query } = context;

    const { localeResolved, ...pageProps } = props;

    if (!localeResolved) {
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
