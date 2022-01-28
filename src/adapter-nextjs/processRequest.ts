import { getRedirectToCanonicalLocale } from '../intl';
import { BasePageProps } from '../types';
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

export function processRequest<Props extends BasePageProps>(
    context: GetServerSidePropsContext,
    basePageProps: BasePageProps,
    canonicalUrl?: string,
    customProps?: Omit<Props, keyof BasePageProps>,
): GetServerSidePropsResult<Props> {
    const { locale, query } = context;

    if (!basePageProps.localeResolved) {
        return { notFound: true };
    }

    if (canonicalUrl) {
        const redirect = getRedirectToCanonicalLocale(basePageProps, locale, canonicalUrl, query);
        if (redirect) {
            return { redirect };
        }
    }

    return {
        props: {
            ...basePageProps,
            ...customProps,
        } as Props,
    };
}
