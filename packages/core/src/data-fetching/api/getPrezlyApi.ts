import type { IncomingMessage } from 'http';

import { getEnvVariables } from '../lib/getEnvVariables.js';

import { PrezlyApi } from './PrezlyApi.js';

export function getPrezlyApi(req?: IncomingMessage): PrezlyApi {
    if (typeof window !== 'undefined') {
        throw new Error('"getPrezlyApi" should only be used on back-end side.');
    }

    // `getEnvVariables` handles both cases for envs parsing - .env and request headers
    const { PREZLY_ACCESS_TOKEN, PREZLY_NEWSROOM_UUID, PREZLY_THEME_UUID } = getEnvVariables(req);

    if (!PREZLY_ACCESS_TOKEN) {
        throw new Error('"PREZLY_ACCESS_TOKEN" is not set in env variables.');
    }

    if (!PREZLY_NEWSROOM_UUID) {
        throw new Error('"PREZLY_NEWSROOM_UUID" is not set in env variables.');
    }

    return new PrezlyApi(PREZLY_ACCESS_TOKEN, PREZLY_NEWSROOM_UUID, PREZLY_THEME_UUID);
}
