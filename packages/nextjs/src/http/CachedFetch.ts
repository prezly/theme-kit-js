import { type Options as CacheOptions, withCache } from './cache';
import type { Fetch } from './types';

export namespace CachedFetch {
    export interface Options extends CacheOptions {
        fetch?: Fetch;
    }

    export function create(options: Options) {
        const fetchImpl = options.fetch ?? fetch;
        return withCache(fetchImpl, options);
    }
}
