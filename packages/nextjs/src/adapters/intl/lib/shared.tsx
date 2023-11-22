/* eslint-disable @typescript-eslint/no-use-before-define,react/jsx-props-no-spreading */
import type { Iso8601Date, Locale, Timezone, UnixTimestampInSeconds } from '@prezly/theme-kit-intl';
import { formatDate, formatTime } from '@prezly/theme-kit-intl';
import type { TimeHTMLAttributes } from 'react';

export function FormattedDate({ value, locale, timezone, ...attributes }: FormattedDate.Props) {
    const dateTime = toDate(value);

    return (
        <time {...attributes} dateTime={dateTime.toISOString()}>
            {formatDate(dateTime, { locale, timezone })}
        </time>
    );
}

export namespace FormattedDate {
    export type Props = {
        value: Date | Iso8601Date | UnixTimestampInSeconds;
        locale: Locale.Code;
        timezone: Timezone;
    } & Omit<TimeHTMLAttributes<HTMLTimeElement>, 'dateTime'>;
}

export function FormattedTime({ value, locale, timezone, ...attributes }: FormattedTime.Props) {
    const dateTime = toDate(value);

    return (
        <time {...attributes} dateTime={dateTime.toISOString()}>
            {formatTime(dateTime, { locale, timezone })}
        </time>
    );
}

export namespace FormattedTime {
    export type Props = {
        value: Date | Iso8601Date | UnixTimestampInSeconds;
        locale: Locale.Code;
        timezone: Timezone;
    } & Omit<TimeHTMLAttributes<HTMLTimeElement>, 'dateTime'>;
}

export function toDate(value: Date | Iso8601Date | UnixTimestampInSeconds): Date {
    if (typeof value === 'string') {
        return new Date(value);
    }

    if (typeof value === 'number') {
        return new Date(value * 1000);
    }

    return value;
}
