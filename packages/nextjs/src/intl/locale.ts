import { LocaleObject } from '@prezly/theme-kit-core';
import type { Redirect } from 'next';
import type { ParsedUrlQuery } from 'querystring';
import { stringify } from 'querystring';

// We use pseudo locale used for localization testing, to reliably determine if we need to fallback to the default newsroom language
export const DUMMY_DEFAULT_LOCALE = 'qps-ploc';

export function getRedirectToCanonicalLocale(
    shortestLocaleCode: string | false,
    nextLocaleIsoCode: string | undefined,
    redirectPath: string,
    query?: ParsedUrlQuery,
): Redirect | undefined {
    // No need to redirect if no particular locale was requested by the application
    if (!nextLocaleIsoCode || nextLocaleIsoCode === DUMMY_DEFAULT_LOCALE) {
        return undefined;
    }

    const shortestLocaleSlug = shortestLocaleCode
        ? LocaleObject.fromAnyCode(shortestLocaleCode).toUrlSlug()
        : shortestLocaleCode;

    if (shortestLocaleSlug !== nextLocaleIsoCode) {
        const prefixedPath =
            redirectPath && !redirectPath.startsWith('/') ? `/${redirectPath}` : redirectPath;

        const urlQuery = query ? `?${stringify(query)}` : '';

        return {
            destination: shortestLocaleSlug
                ? `/${shortestLocaleSlug}${prefixedPath}${urlQuery}`
                : `${prefixedPath}${urlQuery}`,
            permanent: false,
        };
    }

    return undefined;
}
