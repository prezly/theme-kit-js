import type { Redirect } from 'next';
import type { ParsedUrlQuery } from 'querystring';
import { stringify } from 'querystring';

import { getResolvedPath } from '../utils';

// We use pseudo locale used for localization testing, to reliably determine if we need to fallback to the default newsroom language
export const DUMMY_DEFAULT_LOCALE = 'qps-ploc';

export function getRedirectToCanonicalLocale(
    shortestLocaleSlug: string | false,
    nextLocaleIsoCode: string | undefined,
    redirectPath: string,
    query?: ParsedUrlQuery,
): Redirect | undefined {
    // No need to redirect if no particular locale was requested by the application
    if (!nextLocaleIsoCode || nextLocaleIsoCode === DUMMY_DEFAULT_LOCALE) {
        return undefined;
    }

    if (shortestLocaleSlug && shortestLocaleSlug !== nextLocaleIsoCode) {
        const prefixedPath =
            redirectPath && !redirectPath.startsWith('/') ? `/${redirectPath}` : redirectPath;
        const finalPath = shortestLocaleSlug
            ? `/${shortestLocaleSlug}${prefixedPath}`
            : prefixedPath;

        const urlQuery = query ? `?${stringify(query)}` : '';

        return {
            destination: `${getResolvedPath(finalPath)}${urlQuery}`,
            permanent: false,
        };
    }

    return undefined;
}