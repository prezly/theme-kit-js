import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { getShortestLocaleCode } from '../data-fetching';
import { getRedirectToCanonicalLocale, LocaleObject } from '../intl';
import { PageProps, ServerSidePageProps } from '../types';

// TODO: Try to make the typings even more robust
function extractServerSideProps<Props>(props: Props & ServerSidePageProps): {
    pageProps: Props;
    serverSideProps: ServerSidePageProps;
} {
    const { localeResolved, ...pageProps } = props;

    return {
        pageProps: pageProps as unknown as Props,
        serverSideProps: { localeResolved },
    };
}

export function processRequest<Props>(
    context: GetServerSidePropsContext,
    props: Props & PageProps & ServerSidePageProps,
    canonicalUrl?: string,
): GetServerSidePropsResult<Props> {
    const { locale: nextLocale, query } = context;

    const { pageProps, serverSideProps } = extractServerSideProps(props);

    if (!serverSideProps.localeResolved) {
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
        props: pageProps,
    };
}
