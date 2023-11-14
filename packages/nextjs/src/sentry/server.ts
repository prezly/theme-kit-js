import { buildSentryConfig } from './common';

export function buildSentryServerConfig(dsn: string, themeName: string | null) {
    return buildSentryConfig(dsn, themeName);
}
