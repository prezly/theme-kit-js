'use client';

/* eslint-disable react/jsx-props-no-spreading */

import type { Locale } from '@prezly/theme-kit-intl';
import type { ReactElement, ReactNode } from 'react';
import { createContext, useCallback, useContext } from 'react';

import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT, DEFAULT_TIMEZONE } from './lib/constants';
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

interface IntlContext {
    locale: Locale.Code;
    defaultLocale: Locale.Code;
    locales: Locale.Code[];
    messages: IntlDictionary;
    timezone: Timezone;
    dateFormat: DateFormat;
    timeFormat: TimeFormat;
}

export namespace IntlAdapter {
    export interface Options {
        defaults?: Partial<Pick<IntlContext, 'locale' | 'timezone' | 'dateFormat' | 'timeFormat'>>;
    }

    export function connect({ defaults = {} }: Options = {}) {
        const context = createContext<IntlContext>({
            locale: defaults.locale ?? 'en',
            locales: [defaults.locale ?? 'en'],
            defaultLocale: defaults.locale ?? 'en',
            messages: {},
            timezone: defaults.timezone ?? DEFAULT_TIMEZONE,
            dateFormat: defaults.dateFormat ?? DEFAULT_DATE_FORMAT,
            timeFormat: defaults.timeFormat ?? DEFAULT_TIME_FORMAT,
        });

        function IntlContextProvider({
            children,
            ...value
        }: IntlContext & { children: ReactNode }) {
            return <context.Provider value={value}>{children}</context.Provider>;
        }

        function useIntl() {
            const { messages, ...value } = useContext(context);

            const formatMessage = useCallback(
                (descriptor: IntlMessageDescriptor, values?: IntlMessageValues<string>) =>
                    formatMessageString(messages, descriptor, values),
                [messages],
            );

            return { ...value, messages, formatMessage };
        }

        function FormattedMessage(props: {
            for: IntlMessageDescriptor;
            values?: IntlMessageValues<string | ReactElement>;
            locale?: Locale | Locale.Code;
        }) {
            const { messages } = useIntl();

            return formatMessageFragment(messages, props.for, props.values);
        }

        function FormattedDate(props: BaseFormattedDate.Props) {
            const { dateFormat } = useIntl();

            return <BaseFormattedDate format={dateFormat} {...props} />;
        }

        function FormattedTime(props: BaseFormattedTime.Props) {
            const { timeFormat } = useIntl();

            return <BaseFormattedTime format={timeFormat} {...props} />;
        }

        return {
            useIntl,
            IntlContextProvider,
            FormattedMessage,
            FormattedTime,
            FormattedDate,
        };
    }
}
