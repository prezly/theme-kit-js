import type { Exception, init, StackFrame } from '@sentry/nextjs';

const IGNORED_EVENT_CULPRITS = [
    // This usually means that something happened outside of application code.
    // All instances of errors with this origin that I found usually were caused by referring to variables that couldn't ever exist in our code.
    // Likely misbehaving browser extensions or people playing around in DevTools trying to break the app.
    '<anonymous>',
    '?(<anonymous>)',
    'global code',
];

function shouldStackFrameBeIgnored(frame: StackFrame) {
    const { abs_path, function: frameFunction } = frame;

    if (
        abs_path &&
        IGNORED_EVENT_CULPRITS.some((ignoredCulprit) => abs_path.includes(ignoredCulprit))
    ) {
        return true;
    }

    if (
        frameFunction &&
        IGNORED_EVENT_CULPRITS.some((ignoredCulprit) => frameFunction.includes(ignoredCulprit))
    ) {
        return true;
    }

    return false;
}

function shouldExceptionBeIgnored(exception: Exception) {
    const { stacktrace } = exception;

    // Ignore global code errors that are not related to the application code.
    // See comments in `IGNORED_EVENT_CULPRITS` const for context on each entry
    if (stacktrace && stacktrace.frames?.some(shouldStackFrameBeIgnored)) {
        return true;
    }

    return false;
}

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

        beforeSend: (event) => {
            if (event.exception?.values?.every(shouldExceptionBeIgnored)) {
                return null;
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
