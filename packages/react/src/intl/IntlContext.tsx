'use client';

import type {
    IntlDictionary,
    IntlMessageDescriptor,
    IntlMessageValues,
    Locale,
    Timezone,
} from '@prezly/theme-kit-intl';
import { DEFAULT_LOCALE, DEFAULT_TIMEZONE, formatMessageString } from '@prezly/theme-kit-intl';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext } from 'react';

export interface IntlContext {
    locale: Locale.Code;
    defaultLocale: Locale.Code;
    locales: Locale.Code[];
    messages: IntlDictionary;
    timezone: Timezone;
}

const context = createContext<IntlContext>({
    locale: 'en',
    locales: [DEFAULT_LOCALE],
    defaultLocale: DEFAULT_LOCALE,
    messages: {},
    timezone: DEFAULT_TIMEZONE,
});

export function IntlProvider({ children, ...value }: IntlContext & { children: ReactNode }) {
    return <context.Provider value={value}>{children}</context.Provider>;
}

export function useIntl() {
    const { messages, locale, ...value } = useContext(context);

    const formatMessage = useCallback(
        (descriptor: IntlMessageDescriptor, values?: IntlMessageValues<string>) =>
            formatMessageString(locale, descriptor, messages, values),
        [locale, messages],
    );

    return { ...value, locale, messages, formatMessage };
}
