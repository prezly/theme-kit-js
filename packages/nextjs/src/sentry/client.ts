import type { init } from '@sentry/nextjs';

import { getCommonClientOptions } from './common.js';

export function getSentryClientOptions(
    dsn: string,
    themeName: string | null,
): Parameters<typeof init>[0] {
    return getCommonClientOptions(dsn, themeName);
}
