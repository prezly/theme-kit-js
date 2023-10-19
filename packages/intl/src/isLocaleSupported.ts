import { Locale } from './Locale';
import { locales as supportedLocales } from './locales';

export function isLocaleSupported(code: Locale.Code) {
    try {
        return supportedLocales.includes(Locale.toHyphenCode(code));
    } catch {
        return false;
    }
}
