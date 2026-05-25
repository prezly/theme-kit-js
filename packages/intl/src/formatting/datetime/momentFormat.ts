/**
 * Format a Date using a moment.js-style format string against a specific locale and timezone.
 *
 * The Prezly backend stores Newsroom date and time formats in moment.js syntax
 * (see Newsroom['date_format'] and Newsroom['time_format']). This formatter
 * supports the subset of moment tokens that show up in those formats and uses
 * `Intl.DateTimeFormat.formatToParts` so the output is correctly localized and
 * timezone-aware without pulling in a heavy dependency.
 *
 * Supported Newsroom date formats: D/M/YY, M/D/YY, YY/M/D, MMM D, YY,
 * MMM D, YYYY, DD/MM/YYYY, MM/DD/YYYY, DD.MM.YYYY.
 * Supported Newsroom time formats: hh:mm a, HH:mm.
 */

import { Locale } from '../../locales';
import { withCache } from '../../utils';

const TOKEN_PATTERN = /YYYY|YY|MMMM|MMM|MM|M|DD|D|HH|hh|H|h|mm|m|ss|s|a|A/g;

type IntlPart = Intl.DateTimeFormatPart;

const getPartsFormatter = withCache(
    (locale: Locale.Code, timeZone: string) =>
        new Intl.DateTimeFormat(Locale.from(locale).isoCode, {
            timeZone,
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hourCycle: 'h23',
        }),
);

const getMonthFormatter = withCache(
    (locale: Locale.Code, timeZone: string, month: 'long' | 'short' | 'numeric' | '2-digit') =>
        new Intl.DateTimeFormat(Locale.from(locale).isoCode, { timeZone, month }),
);

const get12HourFormatter = withCache(
    (locale: Locale.Code, timeZone: string) =>
        new Intl.DateTimeFormat(Locale.from(locale).isoCode, {
            timeZone,
            hour: 'numeric',
            hourCycle: 'h12',
        }),
);

function findPart(parts: IntlPart[], type: IntlPart['type']): string {
    return parts.find((part) => part.type === type)?.value ?? '';
}

function pad(value: string, length: number): string {
    return value.padStart(length, '0');
}

export function formatWithMomentPattern(
    date: Date,
    pattern: string,
    locale: Locale.Code,
    timeZone: string,
): string {
    const parts = getPartsFormatter(locale, timeZone).formatToParts(date);
    const year = findPart(parts, 'year');
    const dayOfMonth = findPart(parts, 'day');
    const hour24 = findPart(parts, 'hour');
    const minute = findPart(parts, 'minute');
    const second = findPart(parts, 'second');

    return pattern.replace(TOKEN_PATTERN, (match) => {
        switch (match) {
            case 'YYYY':
                return year;
            case 'YY':
                return year.slice(-2);
            case 'MMMM': {
                const monthParts = getMonthFormatter(locale, timeZone, 'long').formatToParts(date);
                return findPart(monthParts, 'month');
            }
            case 'MMM': {
                const monthParts = getMonthFormatter(locale, timeZone, 'short').formatToParts(date);
                return findPart(monthParts, 'month');
            }
            case 'MM': {
                const monthParts = getMonthFormatter(locale, timeZone, '2-digit').formatToParts(
                    date,
                );
                return pad(findPart(monthParts, 'month'), 2);
            }
            case 'M': {
                const monthParts = getMonthFormatter(locale, timeZone, 'numeric').formatToParts(
                    date,
                );
                return findPart(monthParts, 'month');
            }
            case 'DD':
                return pad(dayOfMonth, 2);
            case 'D':
                return String(Number(dayOfMonth));
            case 'HH':
                return pad(hour24, 2);
            case 'H':
                return String(Number(hour24));
            case 'hh':
            case 'h': {
                const hourParts = get12HourFormatter(locale, timeZone).formatToParts(date);
                const hour = findPart(hourParts, 'hour');
                return match === 'hh' ? pad(hour, 2) : String(Number(hour));
            }
            case 'mm':
                return pad(minute, 2);
            case 'm':
                return String(Number(minute));
            case 'ss':
                return pad(second, 2);
            case 's':
                return String(Number(second));
            case 'a':
            case 'A': {
                const hour = Number(hour24);
                const isAm = hour < 12;
                if (match === 'A') return isAm ? 'AM' : 'PM';
                return isAm ? 'am' : 'pm';
            }
            default:
                return match;
        }
    });
}
