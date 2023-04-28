import { assertServerEnv, getEnvVariables } from '@prezly/theme-kit-core';
import type { IncomingMessage } from 'http';

import { NextPrezlyApi } from './NextPrezlyApi';

export function getNextPrezlyApi(req?: IncomingMessage): NextPrezlyApi {
    assertServerEnv('getNextPrezlyApi');

    // `getEnvVariables` handles both cases for envs parsing - .env and request headers
    const { PREZLY_ACCESS_TOKEN, PREZLY_NEWSROOM_UUID, PREZLY_THEME_UUID } = getEnvVariables(req);

    if (!PREZLY_ACCESS_TOKEN) {
        throw new Error('"PREZLY_ACCESS_TOKEN" is not set in env variables.');
    }

    if (!PREZLY_NEWSROOM_UUID) {
        throw new Error('"PREZLY_NEWSROOM_UUID" is not set in env variables.');
    }

    return new NextPrezlyApi(PREZLY_ACCESS_TOKEN, PREZLY_NEWSROOM_UUID, PREZLY_THEME_UUID);
}
