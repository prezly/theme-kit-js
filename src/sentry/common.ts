import type { init } from '@sentry/nextjs';

export function getCommonClientOptions(dsn: string, themeName: string): Parameters<typeof init>[0] {
    return {
        dsn,
        // Adjust this value in production, or use tracesSampler for greater control
        tracesSampleRate: 0.02,
        // ...
        // Note: if you want to override the automatic release value, do not set a
        // `release` value here - use the environment variable `SENTRY_RELEASE`, so
        // that it will also get attached to your source maps

        ignoreErrors: [
            // This particular error is coming from Microsoft Outlook SafeLink crawler.
            // It doesn't affect the user experience in any way, but produces a lot of unwanted Sentry events.
            // See https://forum.sentry.io/t/unhandledrejection-non-error-promise-rejection-captured-with-value/14062
            'Object Not Found Matching Id',
        ],
        // Attach theme tag to each event
        initialScope: (scope) => {
            scope.setTags({ prezly_theme: themeName });
            return scope;
        },
    };
}
