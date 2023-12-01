import { BaseFormattedDate } from './BaseFormattedDate';
import { useIntl } from './IntlContext';
import type { Optional } from './utils';

export function FormattedDate(props: FormattedDate.Props) {
    const { timezone, locale } = useIntl();
    return <BaseFormattedDate timezone={timezone} locale={locale} {...props} />;
}

export namespace FormattedDate {
    export type Props = Optional<BaseFormattedDate.Props, 'locale' | 'timezone'>;
}
