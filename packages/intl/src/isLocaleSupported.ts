import { locales as supportedLocales } from './locales';

export function isLocaleSupported(code: string) {
    return supportedLocales.indexOf(code) >= 0;
}
