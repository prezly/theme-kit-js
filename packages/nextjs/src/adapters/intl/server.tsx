/* eslint-disable @typescript-eslint/no-use-before-define,react/jsx-props-no-spreading */
import { AsyncResolvable } from '@prezly/theme-kit-core';
import type {
    IntlDictionary,
    IntlMessageDescriptor,
    IntlMessageValues,
    Locale,
    Timezone,
} from '@prezly/theme-kit-intl';
import {
    formatMessageFragment,
    formatMessageString,
    pickSupportedLocale,
} from '@prezly/theme-kit-intl';
import type { ReactElement } from 'react';

import {
    FormattedDate as BaseFormattedDate,
    FormattedTime as BaseFormattedTime,
} from './lib/shared';

type Awaitable<T> = T | Promise<T>;

export namespace IntlAdapter {
    export interface Configuration {
        resolveDictionary?: (localeCode: Locale.Code) => Awaitable<IntlDictionary>;
        timezone: AsyncResolvable<Timezone>;
    }

    export function connect({
        resolveDictionary = importThemeKitDictionary,
        ...config
    }: Configuration) {
        async function useIntl(locale: Locale.Code) {
            const timezone = await AsyncResolvable.resolve(config.timezone);

            const messages = await resolveDictionary(locale);

            return {
                messages,
                formatMessage(
                    descriptor: IntlMessageDescriptor,
                    values?: IntlMessageValues<string>,
                ) {
                    return formatMessageString(descriptor, messages, values);
                },
                timezone,
            };
        }

        async function FormattedMessage(props: {
            for: IntlMessageDescriptor;
            values?: IntlMessageValues<string | ReactElement>;
            locale: Locale.Code;
        }) {
            const messages = await resolveDictionary(props.locale);

            return <>{formatMessageFragment(props.for, messages, props.values)}</>;
        }

        async function FormattedDate(props: Omit<BaseFormattedDate.Props, 'timezone'>) {
            const timezone = await AsyncResolvable.resolve(config.timezone);

            return <BaseFormattedDate timezone={timezone} {...props} />;
        }

        async function FormattedTime(props: Omit<BaseFormattedTime.Props, 'timezone'>) {
            const timezone = await AsyncResolvable.resolve(config.timezone);

            return <BaseFormattedTime timezone={timezone} {...props} />;
        }

        return { useIntl, FormattedMessage, FormattedDate, FormattedTime };
    }
}

async function importThemeKitDictionary(localeCode: Locale.Code): Promise<IntlDictionary> {
    const isoCode = pickSupportedLocale(localeCode);

    const messages = await import(`@prezly/theme-kit-intl/i18n/${isoCode}.json`);

    return { ...unwrapModule(messages) };
}

function unwrapModule<T>(module: T | { default: T }): T {
    if (module && typeof module === 'object' && 'default' in module) {
        return module.default;
    }
    return module;
}
