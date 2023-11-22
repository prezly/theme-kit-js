/* eslint-disable @typescript-eslint/no-use-before-define */
import type {
    IntlDictionary,
    IntlMessageDescriptor,
    IntlMessageFormat,
    IntlMessageValues,
} from './types';

export function formatMessageFragment<T>(
    { id, defaultMessage }: IntlMessageDescriptor,
    dictionary: IntlDictionary,
    values: IntlMessageValues<T> = {},
): (T | string)[] {
    const format = dictionary[id] ??
        prepareMessage(defaultMessage) ?? [{ type: 0, value: `[${id}]` }];

    return format.map(({ type, value }) => {
        if (type === 0) {
            return value;
        }

        return values[value] ?? `{${value}}`;
    });
}

export function formatMessageString(
    { id, defaultMessage }: IntlMessageDescriptor,
    dictionary: IntlDictionary,
    values: IntlMessageValues<string | number> = {},
): string {
    const format = dictionary[id] ??
        prepareMessage(defaultMessage) ?? [{ type: 0, value: `[${id}]` }];

    return format
        .map(({ type, value }) => {
            if (type === 0) {
                return value;
            }

            return String(values[value] ?? `{${value}}`);
        })
        .join('');
}

const CACHE = new Map<string, IntlMessageFormat>();

function prepareMessage(message?: string): IntlMessageFormat | undefined {
    if (typeof message === 'undefined') {
        return undefined;
    }

    const cached = CACHE.get(message);
    if (cached) return cached;

    const parsed = parseMessage(message);
    CACHE.set(message, parsed);
    return parsed;
}

function parseMessage(message: string): IntlMessageFormat {
    if (message.length === 0 || message.indexOf('{') === -1) {
        return [{ type: 0, value: message }];
    }

    let remaining = message;
    const format: IntlMessageFormat = [];

    while (remaining.length > 0) {
        const start = remaining.indexOf('{');
        const end = remaining.indexOf('}');

        if (start === -1 || end === -1) {
            format.push({ type: 0, value: remaining });
            break;
        }

        const prefix = remaining.substring(start);
        const placeholder = remaining.substring(start + 1, end);

        if (prefix) format.push({ type: 0, value: prefix });
        if (placeholder) {
            format.push({ type: 1, value: placeholder });
        } else {
            format.push({ type: 0, value: '{}' }); // false-positive?
        }

        remaining = remaining.substring(end + 1);
    }

    return format;
}
