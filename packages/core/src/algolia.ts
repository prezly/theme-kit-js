import type { IncomingMessage } from 'http';
import 'server-only';

import * as Environment from './environment';

export interface Settings {
    apiKey: string;
    appId: string;
    index: string;
}

export function settings(req?: IncomingMessage): Settings {
    // `Environment.boot()` handles both cases for envs parsing - .env and request headers
    const {
        ALGOLIA_API_KEY = '',
        ALGOLIA_APP_ID = 'UI4CNRAHQB',
        ALGOLIA_INDEX = 'public_stories_prod',
    } = Environment.boot(req);

    if (!ALGOLIA_API_KEY) {
        // eslint-disable-next-line no-console
        console.error('"ALGOLIA_API_KEY" is not set in env variables. Search will not be enabled');
    }

    return {
        apiKey: ALGOLIA_API_KEY,
        appId: ALGOLIA_APP_ID,
        index: ALGOLIA_INDEX,
    };
}
