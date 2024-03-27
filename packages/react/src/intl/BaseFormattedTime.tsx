import type { Iso8601Date, Locale, Timezone, UnixTimestampInSeconds } from '@prezly/theme-kit-intl';
import { formatTime } from '@prezly/theme-kit-intl';
import type { TimeHTMLAttributes } from 'react';

import { toDate } from './utils';

export function BaseFormattedTime({
    value,
    locale,
    timezone,
    ...attributes
}: BaseFormattedTime.Props) {
    const dateTime = toDate(value);
    const time = formatTime(dateTime, { locale, timezone })
        .replace(/GMT(?=[+-]\d{2}:\d{2})/g, 'UTC')
        .replace(/(UTC)(\+\d{2}:\d{2})/g, '($1$2)');

    return (
        <time {...attributes} dateTime={dateTime.toISOString()}>
            {time}
        </time>
    );
}

export namespace BaseFormattedTime {
    export interface Props extends Omit<TimeHTMLAttributes<HTMLTimeElement>, 'dateTime'> {
        value: Date | Iso8601Date | UnixTimestampInSeconds;
        locale: Locale.Code;
        timezone: Timezone;
    }
}
