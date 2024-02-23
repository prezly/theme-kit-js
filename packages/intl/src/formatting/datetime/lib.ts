import { Locale } from '../../locales';
import { withCache } from '../../utils';

import { toDate } from './shared';
import type { Iso8601Date, Timezone, UnixTimestampInSeconds } from './types';

const getDateFormat = withCache(
    (locale: Locale.Code, timeZone: string, options: Intl.DateTimeFormatOptions = {}) =>
        new Intl.DateTimeFormat(Locale.from(locale).isoCode, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone,
            ...options,
        }),
);

const getTimeFormat = withCache(
    (locale: Locale.Code, timeZone: string, options: Intl.DateTimeFormatOptions = {}) =>
        new Intl.DateTimeFormat(Locale.from(locale).isoCode, {
            hour: 'numeric',
            minute: 'numeric',
            timeZone,
            timeZoneName: 'shortGeneric',
            ...options,
        }),
);

export function formatDate(
    input: Date | Iso8601Date | UnixTimestampInSeconds,
    context: { locale: Locale.Code; timezone: Timezone },
    options: Intl.DateTimeFormatOptions = {},
) {
    const dateTime = toDate(input);
    const format = getDateFormat(context.locale, context.timezone, options);

    return format.format(dateTime);
}

export function formatTime(
    input: Date | Iso8601Date | UnixTimestampInSeconds,
    context: { locale: Locale.Code; timezone: Timezone },
    options: Intl.DateTimeFormatOptions = {},
) {
    const dateTime = toDate(input);
    const format = getTimeFormat(context.locale, context.timezone, options);

    return format.format(dateTime);
}
