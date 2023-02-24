import type { init } from '@sentry/nextjs';

const IGNORED_EVENT_CULPRITS = [
    // This usually means that something happened outside of application code.
    // All instances of errors with this origin that I found usually were caused by referring to variables that couldn't ever exist in our code.
    // Likely misbehaving browser extensions or people playing around in DevTools trying to break the app.
    '?(<anonymous>)',
    'global code',
];

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
            // This error is caused by `beacon.min.js` polyfill in Cloudflare Insights. From what we see, it doesn't affect the user experience.
            'Illegal invocation',
        ],

        // Ignore global code errors that are not related to the application code.
        // See comments in `IGNORED_EVENT_CULPRITS` const for context on each entry
        beforeSend: (event) => {
            // `culprit` is not a documented property, but it is present in all Sentry events and is even displayed in the interface.
            // Just in case it's not defined, we can fallback to the stack trace.
            if ('culprit' in event && typeof event.culprit === 'string') {
                const { culprit } = event;
                if (
                    IGNORED_EVENT_CULPRITS.some((ignoredCulprit) =>
                        culprit.includes(ignoredCulprit),
                    )
                ) {
                    return null;
                }
            } else if (event.exception) {
                if (
                    event.exception.values?.some((value) =>
                        value.stacktrace?.frames?.some(
                            (frame) =>
                                frame.abs_path &&
                                IGNORED_EVENT_CULPRITS.some((ignoredCulprit) =>
                                    frame.abs_path?.includes(ignoredCulprit),
                                ),
                        ),
                    )
                ) {
                    return null;
                }
            }

            return event;
        },

        // Attach theme tag to each event
        initialScope: (scope) => {
            scope.setTags({ prezly_theme: themeName });
            return scope;
        },
    };
}
