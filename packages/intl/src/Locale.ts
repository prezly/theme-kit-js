/* eslint-disable @typescript-eslint/no-use-before-define */
export interface Locale {
    /**
     * Language code.
     * Examples: `nl`, `en`, `fr`.
     */
    lang: Locale.LanguageCode;

    /**
     * Locale region code.
     * E.g. `en-US` has `US` as region, while `en` is region independent and does not have a `regionCode`.
     */
    region: Locale.RegionCode | undefined;

    /**
     * Locale script code.
     * E.g. `zh-Hant` has `Hant` as script code (this is not a region).
     */
    script: Locale.ScriptCode | undefined;
}

type AnyCode = HyphenCode | UnderscoreCode | UrlSlug;

type HyphenCode = string;
type UnderscoreCode = string;
type UrlSlug = string;

const KNOWN_SCRIPTS = ['hant', 'hans'];
const KNOWN_RTL_LANGUAGES = ['ar', 'he', 'ur'];
const LANG_CODE_REGEX = /^[a-z]{2,3}$/;

export namespace Locale {
    export type Code = string;
    export type LanguageCode = string;
    export type RegionCode = string;
    export type ScriptCode = string;

    export function from(locale: AnyCode | Locale): Locale {
        if (typeof locale === 'object') {
            return locale;
        }

        const [lang, ...rest] = locale.split(/[_-]/g).map((part) => part.toLowerCase());

        if (!lang.match(LANG_CODE_REGEX)) {
            throw new Error(`Invalid locale code provided: "${locale}".`);
        }

        const scripts = rest.filter((s) => KNOWN_SCRIPTS.includes(s));
        const regions = rest.filter((s) => !KNOWN_SCRIPTS.includes(s));

        if (scripts.length > 1) {
            throw new Error(
                `Unable to parse the provided locale code: "${locale}". Multiple script codes detected.`,
            );
        }
        if (regions.length > 1) {
            throw new Error(
                `Unable to parse the provided locale code: "${locale}". Multiple region codes detected.`,
            );
        }

        const script: string | undefined = scripts[0];
        const region: string | undefined = regions[0];

        return {
            lang,
            region: region ? region.toUpperCase() : undefined,
            script: script ? toPascalCase(script) : undefined,
        };
    }

    export function toHyphenCode(locale: AnyCode | Locale): HyphenCode {
        const { lang, region, script } = Locale.from(locale);

        return [
            lang.toLowerCase(),
            region?.toUpperCase(),
            script ? toPascalCase(script) : undefined,
        ]
            .filter(isNotUndefined)
            .join('-');
    }

    export function toUnderscoreCode(locale: AnyCode | Locale): UnderscoreCode {
        return Locale.toHyphenCode(locale).replace('-', '_');
    }

    export function toUrlSlug(locale: AnyCode | Locale): UrlSlug {
        const { lang, region, script } = Locale.from(locale);

        return [lang, region, script]
            .filter(isNotUndefined)
            .map((part) => part.toLowerCase())
            .join('-');
    }

    export function toNeutralLanguageCode(locale: AnyCode | Locale): LanguageCode {
        return Locale.from(locale).lang;
    }

    export function toRegionCode(locale: AnyCode | Locale): RegionCode | undefined {
        return Locale.from(locale).region || undefined;
    }

    export function direction(locale: AnyCode | Locale): 'rtl' | 'ltr' {
        return Locale.isRtl(locale) ? 'rtl' : 'ltr';
    }

    export function isRtl(locale: AnyCode | Locale): boolean {
        return KNOWN_RTL_LANGUAGES.includes(Locale.from(locale).lang);
    }

    export function isLtr(locale: AnyCode | Locale): boolean {
        return !Locale.isRtl(locale);
    }

    export function isRegionIndependent(locale: AnyCode | Locale): boolean {
        return !Locale.from(locale).region;
    }

    export function isEqual(a: Locale | AnyCode, b: Locale | AnyCode): boolean {
        const al = Locale.from(a);
        const bl = Locale.from(b);

        return al.lang === bl.lang && al.region === bl.region && al.script === bl.script;
    }

    export function isSameLang(a: Locale | AnyCode, b: Locale | AnyCode): boolean {
        const al = Locale.from(a);
        const bl = Locale.from(b);

        return al.lang === bl.lang;
    }
}

function isNotUndefined<T>(input: T | undefined): input is T {
    return typeof input !== 'undefined';
}

function toPascalCase(input: string) {
    return `${input.substring(0, 1).toUpperCase()}${input.substring(1).toLowerCase()}`;
}
