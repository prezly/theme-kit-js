/* eslint-disable @typescript-eslint/no-use-before-define */
import { Locale } from '../../locales';
import { withCache } from '../../utils';

import { IntlMessageFormat } from './types';
import type { IntlDictionary, IntlMessageDescriptor, IntlMessageValues } from './types';

export const getPluralRules = withCache(
    (locale: Locale.AnyCode) => new Intl.PluralRules(Locale.from(locale).isoCode),
);

export function formatMessageFragment<T>(
    locale: Locale.Code,
    { id, defaultMessage }: IntlMessageDescriptor,
    dictionary: IntlDictionary,
    values: IntlMessageValues<T> = {},
): (T | string)[] {
    const format = dictionary[id] ??
        prepareMessage(defaultMessage) ?? [{ type: 0, value: `[${id}]` }];

    return format.flatMap((token) => formatToken(locale, token, values));
}

export function formatMessageString(
    locale: Locale.Code,
    { id, defaultMessage }: IntlMessageDescriptor,
    dictionary: IntlDictionary,
    values: IntlMessageValues<string | number> = {},
): string {
    const format = dictionary[id] ??
        prepareMessage(defaultMessage) ?? [
            { type: IntlMessageFormat.Type.LITERAL, value: `[${id}]` },
        ];

    return format.flatMap((token) => formatToken(locale, token, values)).join('');
}

const prepareMessage = withCache((message?: string): IntlMessageFormat | undefined =>
    typeof message !== 'undefined' ? parseMessage(message) : undefined,
);

function formatToken<T>(
    locale: Locale.Code,
    token: IntlMessageFormat[number],
    values: IntlMessageValues<T> = {},
    poundValue?: number | undefined,
): (string | T)[] {
    if (token.type === IntlMessageFormat.Type.LITERAL) {
        return [token.value];
    }

    if (token.type === IntlMessageFormat.Type.ARGUMENT) {
        return [values[token.value] ?? `{${token.value}}`];
    }

    if (token.type === IntlMessageFormat.Type.PLURAL) {
        const value = values[token.value];
        if (typeof value !== 'number') {
            throw new Error(
                `Invalid message parameters given. {${token.value}} param is required to be a number.`,
            );
        }

        const option =
            token.options[`=${value}`] ??
            token.options[getPluralRules(locale).select(value)] ??
            token.options.other;

        return option.value.flatMap((x) => formatToken(locale, x, values, value));
    }

    if (token.type === IntlMessageFormat.Type.POUND) {
        return [String(poundValue ?? '#')];
    }

    throw new Error(`Unsupported token: ${JSON.stringify(token)}`);
}

export function parseMessage(message: string): IntlMessageFormat {
    if (message.length === 0) {
        return [{ type: 0, value: message }];
    }

    const format: IntlMessageFormat = [];

    tokenizeMessage(message).forEach((token) => {
        // literal: "hello"
        if (!token.startsWith('{') || !token.endsWith('}')) {
            format.push({ type: 0, value: token });
            return;
        }

        // plural placeholder: "{var, plural, ...}"
        if (token.indexOf(',') >= 0) {
            const name = (token.split(/[{,}]/)[1] ?? '').trim();
            format.push({ type: 1, value: name });
            return;
        }

        // (assuming) argument: "{var}"
        format.push({ type: 1, value: token.substring(1, token.length - 1) });
    });

    return format;
}

export function tokenizeMessage(message: string) {
    const tokens = message.split(/([{}])/);

    let nesting = 0;
    let result: typeof tokens = [];
    let buffer: string = '';

    tokens.forEach((token) => {
        switch (token) {
            case '{':
                if (nesting === 0 && buffer.length > 0) {
                    result = [...result, buffer];
                    buffer = '';
                }
                buffer += token;
                nesting += 1;
                break;

            case '}':
                buffer += token;
                nesting -= 1;

                if (nesting === 0) {
                    result = [...result, buffer];
                    buffer = '';
                }
                break;

            default:
                buffer += token;
        }
    });

    if (buffer.length > 0) {
        return [...result, buffer];
    }

    return result;
}
