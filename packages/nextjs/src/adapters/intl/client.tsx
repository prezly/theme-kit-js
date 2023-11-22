/* eslint-disable react/jsx-props-no-spreading */

'use client';

import type {
    IntlDictionary,
    IntlMessageDescriptor,
    IntlMessageValues,
    Locale,
    Timezone,
} from '@prezly/theme-kit-intl';
import { formatMessageFragment, formatMessageString } from '@prezly/theme-kit-intl';
import type { ReactElement, ReactNode } from 'react';
import { createContext, useCallback, useContext } from 'react';

import { DEFAULT_TIMEZONE } from './lib/constants';
import {
    FormattedDate as BaseFormattedDate,
    FormattedTime as BaseFormattedTime,
} from './lib/shared';

interface IntlContext {
    locale: Locale.Code;
    defaultLocale: Locale.Code;
    locales: Locale.Code[];
    messages: IntlDictionary;
    timezone: Timezone;
}

export namespace IntlAdapter {
    export interface Options {
        defaults?: Partial<Pick<IntlContext, 'locale' | 'timezone'>>;
    }

    export function connect({ defaults = {} }: Options = {}) {
        const context = createContext<IntlContext>({
            locale: defaults.locale ?? 'en',
            locales: [defaults.locale ?? 'en'],
            defaultLocale: defaults.locale ?? 'en',
            messages: {},
            timezone: defaults.timezone ?? DEFAULT_TIMEZONE,
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
                    formatMessageString(descriptor, messages, values),
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

            return <>{formatMessageFragment(props.for, messages, props.values)}</>;
        }

        function FormattedDate(props: Omit<BaseFormattedDate.Props, 'locale' | 'timezone'>) {
            const { locale, timezone } = useIntl();

            return <BaseFormattedDate locale={locale} timezone={timezone} {...props} />;
        }

        function FormattedTime(props: Omit<BaseFormattedTime.Props, 'locale' | 'timezone'>) {
            const { locale, timezone } = useIntl();

            return <BaseFormattedTime locale={locale} timezone={timezone} {...props} />;
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
