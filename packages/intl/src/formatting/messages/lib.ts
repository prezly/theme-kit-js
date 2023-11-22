import type { IntlDictionary, IntlMessageDescriptor, IntlMessageValues } from './types';

export function formatMessageFragment<T>(
    { id, defaultMessage }: IntlMessageDescriptor,
    dictionary: IntlDictionary,
    values: IntlMessageValues<T> = {},
): (T | string)[] {
    const format = dictionary[id] ?? defaultMessage ?? { type: 0, value: `[${id}]` };

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
    const format = dictionary[id] ?? defaultMessage ?? { type: 0, value: `[${id}]` };

    return format
        .map(({ type, value }) => {
            if (type === 0) {
                return value;
            }

            return String(values[value] ?? `{${value}}`);
        })
        .join('');
}
