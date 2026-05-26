'use client';

import { BaseFormattedTime } from './BaseFormattedTime';
import { useIntl } from './IntlContext';
import type { Optional } from './utils';

export function FormattedTime(props: FormattedTime.Props) {
    const { timezone, locale, timeFormat } = useIntl();
    return (
        <BaseFormattedTime timezone={timezone} locale={locale} timeFormat={timeFormat} {...props} />
    );
}

export namespace FormattedTime {
    export type Props = Optional<BaseFormattedTime.Props, 'locale' | 'timezone'>;
}
