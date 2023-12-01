import type {
    IntlDictionary,
    IntlMessageDescriptor,
    IntlMessageValues,
    Locale,
} from '@prezly/theme-kit-intl';
import { formatMessageFragment } from '@prezly/theme-kit-intl';
import type { ReactElement } from 'react';

export function BaseFormattedMessage(props: BaseFormattedMessage.Props) {
    return <>{formatMessageFragment(props.for, props.messages, props.values)}</>;
}

export namespace BaseFormattedMessage {
    export interface Props {
        messages: IntlDictionary;
        for: IntlMessageDescriptor;
        values?: IntlMessageValues<string | ReactElement>;
        locale?: Locale | Locale.Code;
    }
}
