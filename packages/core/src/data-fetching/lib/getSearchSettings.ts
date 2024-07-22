import type { IncomingMessage } from 'http';

import { assertServerEnv } from '../../utils';
import type { SearchSettings } from '../types';

import { getEnvVariables } from './getEnvVariables';

export function getSearchSettings(req?: IncomingMessage): SearchSettings | undefined {
    assertServerEnv('getSearchSettings');

    // `getEnvVariables` handles both cases for envs parsing - .env and request headers
    const {
        ALGOLIA_API_KEY = '',
        ALGOLIA_APP_ID = 'UI4CNRAHQB',
        ALGOLIA_INDEX = 'public_stories_prod',
        MEILISEARCH_API_KEY,
        MEILISEARCH_HOST = 'https://search.prezly.com',
        MEILISEARCH_INDEX = 'public_stories',
    } = getEnvVariables(req);

    if (MEILISEARCH_API_KEY && MEILISEARCH_HOST && MEILISEARCH_INDEX) {
        return {
            apiKey: MEILISEARCH_API_KEY,
            host: MEILISEARCH_HOST,
            index: MEILISEARCH_INDEX,
            searchBackend: 'meilisearch',
        };
    }

    if (ALGOLIA_API_KEY && ALGOLIA_APP_ID && ALGOLIA_INDEX) {
        return {
            apiKey: ALGOLIA_API_KEY,
            appId: ALGOLIA_APP_ID,
            index: ALGOLIA_INDEX,
            searchBackend: 'algolia',
        };
    }

    return undefined;
}
