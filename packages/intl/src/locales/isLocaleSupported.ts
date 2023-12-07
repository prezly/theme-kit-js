import { Locale } from './Locale';
import { supportedLocales } from './supportedLocales';

export function isLocaleSupported(code: Locale | Locale.AnyCode) {
    try {
        return supportedLocales.includes(Locale.from(code).isoCode);
    } catch {
        return false;
    }
}
