import type { init } from '@sentry/nextjs';

import { getCommonClientOptions } from './common';

export function getSentryServerOptions(dsn: string, themeName: string): Parameters<typeof init>[0] {
    return getCommonClientOptions(dsn, themeName);
}
