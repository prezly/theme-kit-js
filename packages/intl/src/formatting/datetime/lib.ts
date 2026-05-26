import { Locale } from '../../locales';
import { withCache } from '../../utils';

import { formatWithMomentPattern } from './momentFormat';
import { toDate } from './shared';
import type { Iso8601Date, Timezone, UnixTimestampInSeconds } from './types';

export const getDateFormat = withCache(
    (locale: Locale.Code, timeZone: string, options: Intl.DateTimeFormatOptions = {}) =>
        new Intl.DateTimeFormat(Locale.from(locale).isoCode, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone,
            ...options,
        }),
);

export const getTimeFormat = withCache(
    (locale: Locale.Code, timeZone: string, options: Intl.DateTimeFormatOptions = {}) =>
        new Intl.DateTimeFormat(Locale.from(locale).isoCode, {
            hour: 'numeric',
            minute: 'numeric',
            timeZone,
            timeZoneName: 'longOffset',
            ...options,
        }),
);

const getTimezoneOffsetFormat = withCache(
    (locale: Locale.Code, timeZone: string) =>
        new Intl.DateTimeFormat(Locale.from(locale).isoCode, {
            timeZone,
            timeZoneName: 'longOffset',
            hour: 'numeric',
        }),
);

function getTimezoneOffsetString(date: Date, locale: Locale.Code, timezone: string): string {
    const parts = getTimezoneOffsetFormat(locale, timezone).formatToParts(date);
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
}

export function formatDate(
    input: Date | Iso8601Date | UnixTimestampInSeconds,
    context: { locale: Locale.Code; timezone: Timezone; dateFormat?: string },
    options: Intl.DateTimeFormatOptions = {},
) {
    const dateTime = toDate(input);

    if (context.dateFormat) {
        return formatWithMomentPattern(
            dateTime,
            context.dateFormat,
            context.locale,
            context.timezone,
        );
    }

    const format = getDateFormat(context.locale, context.timezone, options);

    return format.format(dateTime);
}

export function formatTime(
    input: Date | Iso8601Date | UnixTimestampInSeconds,
    context: { locale: Locale.Code; timezone: Timezone; timeFormat?: string },
    options: Intl.DateTimeFormatOptions = {},
) {
    const dateTime = toDate(input);

    if (context.timeFormat) {
        const formatted = formatWithMomentPattern(
            dateTime,
            context.timeFormat,
            context.locale,
            context.timezone,
        );
        const offset = getTimezoneOffsetString(dateTime, context.locale, context.timezone);
        return offset ? `${formatted} ${offset}` : formatted;
    }

    const format = getTimeFormat(context.locale, context.timezone, options);

    return format.format(dateTime);
}
