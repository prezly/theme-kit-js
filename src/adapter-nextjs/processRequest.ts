import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { getShortestLocaleCode } from '../data-fetching';
import { getRedirectToCanonicalLocale, LocaleObject } from '../intl';
import { NewsroomContextProps } from '../newsroom-context';
import { ServerSidePageProps } from '../types';

export function processRequest<Props extends NewsroomContextProps>(
    context: GetServerSidePropsContext,
    props: Props & ServerSidePageProps,
    canonicalUrl?: string,
): GetServerSidePropsResult<Props> {
    const { locale: nextLocale, query } = context;

    const { localeResolved, ...pageProps } = props;

    if (!localeResolved) {
        return { notFound: true };
    }

    if (canonicalUrl) {
        const { languages, localeCode } = props;
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
        props: pageProps as unknown as Props,
    };
}
