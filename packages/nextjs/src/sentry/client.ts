import { buildSentryConfig } from './common';

export function buildSentryClientConfig(dsn: string, themeName: string | null) {
    return buildSentryConfig(dsn, themeName);
}
