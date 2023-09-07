import { getResolvedPath } from '../../../utils';

// Returns absolute URL based on the path and without any query parameters
export function getAbsoluteUrl(path: string, origin: string, localeCode?: string | false): string {
    const prefixedPath = path && !path.startsWith('/') ? `/${path}` : path;
    const finalPath = localeCode ? `/${localeCode}${prefixedPath || ''}` : `${prefixedPath || '/'}`;

    const url = new URL(getResolvedPath(finalPath), origin);
    url.search = '';

    return url.toString();
}
