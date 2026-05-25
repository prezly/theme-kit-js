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
    importDictionary as importThemeKitDictionary,
} from '@prezly/theme-kit-intl';
import {
    FormattedDate as BaseFormattedDate,
    FormattedTime as BaseFormattedTime,
} from '@prezly/theme-kit-react';
import type { ReactElement } from 'react';

type Awaitable<T> = T | Promise<T>;

export namespace IntlAdapter {
    export interface Configuration {
        resolveDictionary?: (localeCode: Locale.Code) => Awaitable<IntlDictionary>;
        timezone: AsyncResolvable<Timezone>;
        /**
         * Optional moment.js style date format from `Newsroom['date_format']`.
         */
        dateFormat?: AsyncResolvable<string | undefined>;
        /**
         * Optional moment.js style time format from `Newsroom['time_format']`.
         */
        timeFormat?: AsyncResolvable<string | undefined>;
    }

    export function connect({
        resolveDictionary = importThemeKitDictionary,
        ...config
    }: Configuration) {
        async function useIntl(locale: Locale.Code) {
            const timezone = await AsyncResolvable.resolve(config.timezone);
            const dateFormat = config.dateFormat
                ? await AsyncResolvable.resolve(config.dateFormat)
                : undefined;
            const timeFormat = config.timeFormat
                ? await AsyncResolvable.resolve(config.timeFormat)
                : undefined;

            const messages = await resolveDictionary(locale);

            return {
                messages,
                formatMessage(
                    descriptor: IntlMessageDescriptor,
                    values?: IntlMessageValues<string>,
                ) {
                    return formatMessageString(locale, descriptor, messages, values);
                },
                timezone,
                dateFormat,
                timeFormat,
            };
        }

        async function FormattedMessage(props: {
            for: IntlMessageDescriptor;
            values?: IntlMessageValues<string | ReactElement>;
            locale: Locale.Code;
        }) {
            const messages = await resolveDictionary(props.locale);

            return <>{formatMessageFragment(props.locale, props.for, messages, props.values)}</>;
        }

        async function FormattedDate(props: Omit<BaseFormattedDate.Props, 'timezone'>) {
            const timezone = await AsyncResolvable.resolve(config.timezone);
            const dateFormat = config.dateFormat
                ? await AsyncResolvable.resolve(config.dateFormat)
                : undefined;

            return <BaseFormattedDate timezone={timezone} dateFormat={dateFormat} {...props} />;
        }

        async function FormattedTime(props: Omit<BaseFormattedTime.Props, 'timezone'>) {
            const timezone = await AsyncResolvable.resolve(config.timezone);
            const timeFormat = config.timeFormat
                ? await AsyncResolvable.resolve(config.timeFormat)
                : undefined;

            return <BaseFormattedTime timezone={timezone} timeFormat={timeFormat} {...props} />;
        }

        return { useIntl, FormattedMessage, FormattedDate, FormattedTime };
    }
}
