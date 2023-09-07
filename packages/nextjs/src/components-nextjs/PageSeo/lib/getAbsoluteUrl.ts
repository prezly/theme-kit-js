import { getResolvedPath } from '../../../utils';

// Returns absolute URL based on the path and without any query parameters
export function getAbsoluteUrl(path: string, origin: string, localeCode?: string | false): string {
    const finalPath = localeCode ? `/${localeCode}${path || ''}` : `${path || '/'}`;

    const url = new URL(getResolvedPath(finalPath), origin);
    url.search = '';

    return url.toString();
}
