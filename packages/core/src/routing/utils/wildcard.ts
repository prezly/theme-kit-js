import type UrlPattern from 'url-pattern';

/**
 * A route pattern can end in one named wildcard: `/category/*path`. Unlike a `:param`, which is
 * one segment of the URL, a wildcard takes every segment that is left: `cars/models/eqs`.
 *
 * `url-pattern` only knows unnamed wildcards (`*`), which it reports as `_`. These helpers
 * translate between the two, so routes and their params only ever see the name.
 */
const NAMED_WILDCARD = /\*([A-Za-z][A-Za-z0-9]*)/;

const UNNAMED = '_';

export interface Wildcard {
    /**
     * The pattern as `url-pattern` understands it.
     */
    pattern: string;
    /**
     * Name of the wildcard param, if the pattern has one.
     */
    name: string | undefined;
}

export function parseWildcard(pattern: string): Wildcard {
    const [, name] = pattern.match(NAMED_WILDCARD) ?? [];

    return { pattern: name ? pattern.replace(NAMED_WILDCARD, '*') : pattern, name };
}

/**
 * Params as a route sees them, from what `url-pattern` matched.
 */
export function fromMatch<T extends Record<string, unknown>>(
    matched: T,
    name: Wildcard['name'],
): T {
    if (!name || !(UNNAMED in matched)) return matched;

    const { [UNNAMED]: value, ...params } = matched;
    return { ...params, [name]: value } as T;
}

/**
 * Params as `url-pattern` wants them to build a URL.
 */
export function toStringifyParams<T extends Record<string, unknown>>(
    params: T,
    name: Wildcard['name'],
): T {
    if (!name || !(name in params)) return params;

    const { [name]: value, ...rest } = params;
    return { ...rest, [UNNAMED]: value } as unknown as T;
}

/**
 * Encodes a wildcard value for a URL, keeping the slashes between its segments.
 */
export function encodeWildcard(value: string): string {
    return value.split('/').map(encodeURIComponent).join('/');
}

export function stringify(
    urlPattern: UrlPattern,
    params: Record<string, unknown>,
    name: Wildcard['name'],
): string {
    return urlPattern.stringify(toStringifyParams(params, name));
}
