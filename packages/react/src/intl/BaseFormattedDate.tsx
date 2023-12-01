import type { Iso8601Date, Locale, Timezone, UnixTimestampInSeconds } from '@prezly/theme-kit-intl';
import { formatDate } from '@prezly/theme-kit-intl';
import type { TimeHTMLAttributes } from 'react';

import { toDate } from './utils';

export function BaseFormattedDate({
    value,
    locale,
    timezone,
    ...attributes
}: BaseFormattedDate.Props) {
    const dateTime = toDate(value);

    return (
        <time {...attributes} dateTime={dateTime.toISOString()}>
            {formatDate(dateTime, { locale, timezone })}
        </time>
    );
}

export namespace BaseFormattedDate {
    export interface Props extends Omit<TimeHTMLAttributes<HTMLTimeElement>, 'dateTime'> {
        value: Date | Iso8601Date | UnixTimestampInSeconds;
        locale: Locale.Code;
        timezone: Timezone;
    }
}
