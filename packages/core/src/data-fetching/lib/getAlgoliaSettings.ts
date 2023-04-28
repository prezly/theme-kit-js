import type { IncomingMessage } from 'http';

import { assertServerEnv } from '../../utils';
import type { AlgoliaSettings } from '../types';

import { getEnvVariables } from './getEnvVariables';

export function getAlgoliaSettings(req?: IncomingMessage): AlgoliaSettings {
    assertServerEnv('getAlgoliaSettings');

    // `getEnvVariables` handles both cases for envs parsing - .env and request headers
    const {
        ALGOLIA_API_KEY = '',
        ALGOLIA_APP_ID = 'UI4CNRAHQB',
        ALGOLIA_INDEX = 'public_stories_prod',
    } = getEnvVariables(req);

    if (!ALGOLIA_API_KEY) {
        // eslint-disable-next-line no-console
        console.error('"ALGOLIA_API_KEY" is not set in env variables. Search will not be enabled');
    }

    return {
        ALGOLIA_API_KEY,
        ALGOLIA_APP_ID,
        ALGOLIA_INDEX,
    };
}
