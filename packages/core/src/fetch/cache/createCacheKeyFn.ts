/* eslint-disable @typescript-eslint/no-use-before-define */

import type { GetCacheKey } from '@e1himself/cached-fetch';

const DEFAULT_CACHE_METHODS = ['GET'];

/**
 * Based on https://github.com/y-nk/nonorepo/blob/711b9784c8c2bbf53a8036938f2b925c6b1e7b6b/cached-fetch/src/getCacheKey.ts#L1C1-L48C2
 */
export function createCacheKeyFn(
    methods: Request['method'][] = DEFAULT_CACHE_METHODS,
): GetCacheKey {
    const allowedMethods = methods.map((method) => method.toLowerCase());

    return (...args) => {
        const [input, init] = args;

        const req =
            input instanceof Request ? input : new Request(input as RequestInfo | URL, init);

        const hasBody = Boolean(init?.body);
        const strBody = typeof init?.body === 'string' ? init.body : undefined;

        // only cache the specified methods
        if (!isMethod(req.method, allowedMethods)) {
            return false;
        }

        if (hasBody && typeof strBody === 'undefined') {
            return false; // cannot cache a POST request with non-string body
        }

        const keys: (keyof Request)[] = [
            //    'cache', // string -> makes no sense from "only-if-cached" PoV, but for dedupe maybe?
            'credentials', // string
            'destination', // string
            'integrity', // string
            'method', // string
            'mode', // string
            'redirect', // string
            'referrer', // string
            'referrerPolicy', // string
            'url', // string
        ];

        // header keys should be lowercase
        const headers: [string, string][] = [];
        req.headers.forEach((value, key) => {
            headers.push([key.toLowerCase(), value ?? '']);
        });

        const fingerprint = [
            req.method,
            headers.sort((a, b) => cmp(a, b)),
            ...keys.map((key) => [key, req[key] ?? '']),
            strBody,
        ];

        return JSON.stringify(fingerprint);
    };
}

function isMethod(requestMethod: Request['method'], methods: Request['method'][]) {
    return methods.includes(requestMethod.toLowerCase());
}

function cmp(a: [string, string], b: [string, string]): number;
function cmp(a: string, b: string): number;
function cmp<T extends string | [string, string]>(a: T, b: T): number {
    if (typeof a === 'string' || typeof b === 'string') {
        if (a === b) return 0;
        return a < b ? -1 : 1;
    }
    return cmp(a[0], b[0]) || cmp(a[1], b[1]);
}
