import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { getShortestLocaleCode } from '../data-fetching';
import { getRedirectToCanonicalLocale, LocaleObject } from '../intl';
import { BasePageProps } from '../types';

export function processRequest<Props extends BasePageProps>(
    context: GetServerSidePropsContext,
    basePageProps: BasePageProps,
    canonicalUrl?: string,
    customProps?: Omit<Props, keyof BasePageProps>,
): GetServerSidePropsResult<Props> {
    const { locale: nextLocale, query } = context;

    const { localeResolved, ...newsroomContextProps } = basePageProps;

    if (!localeResolved) {
        return { notFound: true };
    }

    if (canonicalUrl) {
        const { languages, localeCode } = newsroomContextProps;
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
        props: {
            ...newsroomContextProps,
            ...customProps,
        } as Props,
    };
}
