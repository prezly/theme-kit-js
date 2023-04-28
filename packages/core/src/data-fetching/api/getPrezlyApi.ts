import type { IncomingMessage } from 'http';

import { assertServerEnv } from '../../utils';
import { getEnvVariables } from '../lib/getEnvVariables';

import { PrezlyApi } from './PrezlyApi';

export function getPrezlyApi(req?: IncomingMessage): PrezlyApi {
    assertServerEnv('getPrezlyApi');

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
