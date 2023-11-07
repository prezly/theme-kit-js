import { Locale } from './Locale';
import { locales as supportedLocales } from './locales';

export function isLocaleSupported(code: Locale | Locale.AnyCode) {
    try {
        return supportedLocales.includes(Locale.from(code).isoCode);
    } catch {
        return false;
    }
}
