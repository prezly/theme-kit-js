/* eslint-disable @typescript-eslint/no-use-before-define,react/jsx-props-no-spreading */
import type { TimeHTMLAttributes } from 'react';

import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT } from './constants';
import type { DateFormat, Iso8601Date, TimeFormat, UnixTimestampInSeconds } from './types';

type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

const MONTH_NAME = {
    1: 'Jan', // eslint-disable-line @typescript-eslint/naming-convention
    2: 'Feb', // eslint-disable-line @typescript-eslint/naming-convention
    3: 'Mar', // eslint-disable-line @typescript-eslint/naming-convention
    4: 'Apr', // eslint-disable-line @typescript-eslint/naming-convention
    5: 'May', // eslint-disable-line @typescript-eslint/naming-convention
    6: 'Jun', // eslint-disable-line @typescript-eslint/naming-convention
    7: 'Jul', // eslint-disable-line @typescript-eslint/naming-convention
    8: 'Aug', // eslint-disable-line @typescript-eslint/naming-convention
    9: 'Sep', // eslint-disable-line @typescript-eslint/naming-convention
    10: 'Oct', // eslint-disable-line @typescript-eslint/naming-convention
    11: 'Nov', // eslint-disable-line @typescript-eslint/naming-convention
    12: 'Dec', // eslint-disable-line @typescript-eslint/naming-convention
} as const satisfies Record<Month, string>;

export function formatDate(
    value: Date | Iso8601Date | UnixTimestampInSeconds,
    dateFormat: DateFormat,
) {
    const dateTime = toDate(value);

    const year = dateTime.getFullYear();
    const month = (dateTime.getMonth() + 1) as Month;
    const day = dateTime.getDate();

    const monthName = MONTH_NAME[month];

    return replace(dateFormat, {
        [`YYYY`]: year,
        [`YY`]: year % 100,
        [`MMM`]: monthName, // FIXME: Add i18n for these
        [`MM`]: month < 10 ? `0${month}` : `${month}`,
        [`M`]: month,
        [`DD`]: day < 10 ? `0${day}` : `${day}`,
        [`D`]: day,
    });
}

export function formatTime(
    value: Date | Iso8601Date | UnixTimestampInSeconds,
    timeFormat: TimeFormat,
) {
    const dateTime = toDate(value);

    const hours = dateTime.getHours();

    return replace(timeFormat, {
        [`HH`]: hours,
        [`hh`]: hours === 0 ? 12 : hours % 12,
        [`mm`]: dateTime.getMinutes(),
        [`a`]: hours === 0 || hours < 12 ? 'am' : 'pm', // FIXME: Add i18n for these maybe?
    });
}

export function FormattedDate({
    format = DEFAULT_DATE_FORMAT,
    value,
    ...attributes
}: FormattedDate.Props) {
    const dateTime = toDate(value);

    return (
        <time {...attributes} dateTime={dateTime.toISOString()}>
            {formatDate(dateTime, format)}
        </time>
    );
}

export namespace FormattedDate {
    export type Props = {
        value: Date | Iso8601Date | UnixTimestampInSeconds;
        format?: DateFormat;
    } & Omit<TimeHTMLAttributes<HTMLTimeElement>, 'dateTime'>;
}

export function FormattedTime({
    format = DEFAULT_TIME_FORMAT,
    value,
    ...attributes
}: FormattedTime.Props) {
    const dateTime = toDate(value);

    return (
        <time {...attributes} dateTime={dateTime.toISOString()}>
            {formatTime(dateTime, format)}
        </time>
    );
}

export namespace FormattedTime {
    export type Props = {
        value: Date | Iso8601Date | UnixTimestampInSeconds;
        format?: TimeFormat;
    } & Omit<TimeHTMLAttributes<HTMLTimeElement>, 'dateTime'>;
}

function replace(text: string, replacements: Record<string, string | number>): string {
    const pattern = new RegExp(
        Object.keys(replacements)
            .sort((a, b) => -cmp(a.length, b.length))
            .join('|'),
        'g',
    );

    return text.replace(pattern, (substring) => String(replacements[substring]));
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

function cmp(a: number, b: number) {
    if (a === b) return 0;
    return a < b ? -1 : 1;
}
