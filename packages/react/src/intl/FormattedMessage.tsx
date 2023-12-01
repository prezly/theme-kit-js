import { BaseFormattedMessage } from './BaseFormattedMessage';
import { useIntl } from './IntlContext';
import type { Optional } from './utils';

export function FormattedMessage(props: FormattedMessage.Props) {
    const { messages } = useIntl();
    return <BaseFormattedMessage messages={messages} {...props} />;
}

export namespace FormattedMessage {
    export type Props = Optional<BaseFormattedMessage.Props, 'messages'>;
}
