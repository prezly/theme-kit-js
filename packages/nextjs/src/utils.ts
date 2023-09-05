/**
 * Adds the base path to the given path, if provided via the env variable.
 *
 */
export function getResolvedPath(path?: undefined): string | undefined;
export function getResolvedPath(path: string): string;
export function getResolvedPath(path?: string) {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH;
    const prefixedPath = path && !path.startsWith('/') ? `/${path}` : path;
    if (!basePath) {
        return prefixedPath;
    }

    if (prefixedPath === '/' || !prefixedPath) {
        return basePath;
    }

    return `${basePath}${prefixedPath}`;
}
