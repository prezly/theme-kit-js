/* eslint-disable @typescript-eslint/no-use-before-define,react/jsx-props-no-spreading */
import { type Locale, pickSupportedLocale } from '@prezly/theme-kit-intl';
import type { ReactElement } from 'react';

import { type AsyncResolvable, type Resolvable, resolve, resolveAsync } from '../../utils';

import {
    FormattedDate as BaseFormattedDate,
    FormattedTime as BaseFormattedTime,
    formatMessageFragment,
    formatMessageString,
} from './lib/shared';
import type {
    DateFormat,
    IntlDictionary,
    IntlMessageDescriptor,
    IntlMessageValues,
    TimeFormat,
    Timezone,
} from './lib/types';

type Awaitable<T> = T | Promise<T>;

export namespace IntlAdapter {
    export interface Configuration {
        resolveDictionary?: (localeCode: Locale.Code) => Awaitable<IntlDictionary>;
        locale: Resolvable<Locale.Code>;
        dateFormat: AsyncResolvable<DateFormat>;
        timeFormat: AsyncResolvable<TimeFormat>;
        timezone: AsyncResolvable<Timezone>;
    }

    export function connect({
        resolveDictionary = importThemeKitDictionary,
        ...config
    }: Configuration) {
        async function useIntl() {
            const localeCode = resolve(config.locale);

            const [timezone, dateFormat, timeFormat] = await resolveAsync(
                config.timezone,
                config.dateFormat,
                config.timeFormat,
            );

            const messages = await resolveDictionary(localeCode);

            return {
                locale: localeCode,
                messages,
                formatMessage(
                    descriptor: IntlMessageDescriptor,
                    values?: IntlMessageValues<string>,
                ) {
                    return formatMessageString(messages, descriptor, values);
                },
                timezone,
                dateFormat,
                timeFormat,
            };
        }

        async function FormattedMessage(props: {
            for: IntlMessageDescriptor;
            values?: IntlMessageValues<string | ReactElement>;
            locale?: Locale.Code;
        }) {
            const dictionary = await resolveDictionary(props.locale ?? resolve(config.locale));

            return formatMessageFragment(dictionary, props.for, props.values);
        }

        async function FormattedDate(props: BaseFormattedDate.Props) {
            const dateFormat = await resolveAsync(config.dateFormat);

            return <BaseFormattedDate format={dateFormat} {...props} />;
        }

        async function FormattedTime(props: BaseFormattedTime.Props) {
            const timeFormat = await resolveAsync(config.timeFormat);

            return <BaseFormattedTime format={timeFormat} {...props} />;
        }

        return { useIntl, FormattedMessage, FormattedDate, FormattedTime };
    }
}

async function importThemeKitDictionary(localeCode: Locale.Code): Promise<IntlDictionary> {
    const isoCode = pickSupportedLocale(localeCode);

    const messages = await import(`@prezly/theme-kit-intl/i18n/${isoCode}.json`);

    return { ...messages };
}
