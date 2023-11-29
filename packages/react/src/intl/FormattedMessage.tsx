import type { IntlMessageDescriptor, IntlMessageValues, Locale } from '@prezly/theme-kit-intl';
import { formatMessageFragment } from '@prezly/theme-kit-intl';
import type { ReactElement } from 'react';

import { useIntl } from './IntlContext';

export function FormattedMessage(props: {
    for: IntlMessageDescriptor;
    values?: IntlMessageValues<string | ReactElement>;
    locale?: Locale | Locale.Code;
}) {
    const { messages } = useIntl();

    return <>{formatMessageFragment(props.for, messages, props.values)}</>;
}
