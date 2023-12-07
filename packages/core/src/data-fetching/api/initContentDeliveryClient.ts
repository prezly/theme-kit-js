import { createPrezlyClient } from '@prezly/sdk';
import type { IncomingMessage } from 'http';

import { ContentDelivery } from '../../content-delivery';
import * as Environment from '../../environment';
import { assertServerEnv } from '../../utils';

export function initContentDeliveryClient(
    req?: IncomingMessage,
    options?: ContentDelivery.Options,
): ContentDelivery.Client {
    assertServerEnv('initContentDeliveryClient');

    // `Environment.boot` handles both cases for envs parsing - .env and request headers
    const { PREZLY_ACCESS_TOKEN, PREZLY_NEWSROOM_UUID, PREZLY_THEME_UUID } = Environment.boot(req);

    if (!PREZLY_ACCESS_TOKEN) {
        throw new Error('"PREZLY_ACCESS_TOKEN" is not set in env variables.');
    }

    if (!PREZLY_NEWSROOM_UUID) {
        throw new Error('"PREZLY_NEWSROOM_UUID" is not set in env variables.');
    }

    const prezly = createPrezlyClient({
        accessToken: PREZLY_ACCESS_TOKEN,
        baseUrl: process.env.API_BASE_URL_OVERRIDE || undefined,
    });

    return ContentDelivery.createClient(prezly, PREZLY_NEWSROOM_UUID, PREZLY_THEME_UUID, options);
}
