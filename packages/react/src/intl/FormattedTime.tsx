/* eslint-disable @typescript-eslint/no-use-before-define,react/jsx-props-no-spreading */
import type { Iso8601Date, Locale, Timezone, UnixTimestampInSeconds } from '@prezly/theme-kit-intl';
import { formatTime } from '@prezly/theme-kit-intl';
import type { TimeHTMLAttributes } from 'react';

import { toDate } from './utils';

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
