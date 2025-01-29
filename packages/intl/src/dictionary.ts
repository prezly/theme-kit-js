import type { IntlDictionary } from './formatting';
import { type Locale, pickSupportedLocale } from './locales';

export async function importDictionary(localeCode: Locale.Code): Promise<IntlDictionary> {
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
