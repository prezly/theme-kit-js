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

    return (
        <time {...attributes} dateTime={dateTime.toISOString()}>
            {formatTime(dateTime, { locale, timezone }).replace('GMT', 'UTC')}
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
