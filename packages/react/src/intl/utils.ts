import type { Iso8601Date, UnixTimestampInSeconds } from '@prezly/theme-kit-intl';

export function toDate(value: Date | Iso8601Date | UnixTimestampInSeconds): Date {
    if (typeof value === 'string') {
        return new Date(value);
    }

    if (typeof value === 'number') {
        return new Date(value * 1000);
    }

    return value;
}
