/* eslint-disable @typescript-eslint/no-use-before-define */

import { isNotUndefined } from '@technically/is-not-undefined';

export interface Locale {
    /**
     * Full locale code with underscores.
     * Example: 'nl_BE'
     */
    code: Locale.Code;

    /**
     * Full locale code in ISO format (with dashes instead of underscores)
     * Example: 'nl-BE'
     */
    isoCode: Locale.IsoCode;

    /**
     * URL-friendly case-insensitive locale code.
     * Example: 'nl-be'
     */
    slug: Locale.UrlSlug;

    /**
     * Language code.
     * Examples: `nl`, `en`, `fr`.
     */
    lang: Locale.LanguageCode;

    /**
     * Text direction for the locale.
     */
    dir: 'ltr' | 'rtl';

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

const KNOWN_SCRIPTS = ['hant', 'hans'];
const KNOWN_RTL_LANGUAGES = ['ar', 'he', 'ur'];
const LANG_CODE_REGEX = /^[a-z]{2,3}$/;

const CACHE = new Map<Locale.AnyCode, Locale>();

export namespace Locale {
    export type AnyCode = Code | IsoCode | UrlSlug;
    /**
     * Shortest possible slug that can identify a locale for the given newsroom.
     * This can be full language code or lowercase region code if they're unanbiguously identify a locale
     * or full locale slug if nothing else applies.
     */
    export type AnySlug = UrlSlug | LanguageCode | LowercaseRegionCode;

    type HyphenCode = string;
    type UnderscoreCode = string;

    export type Code = UnderscoreCode;
    export type IsoCode = HyphenCode;
    export type UrlSlug = string;

    export type LanguageCode = string;
    export type RegionCode = string;
    export type ScriptCode = string;

    type LowercaseRegionCode = string;

    export function from(locale: AnyCode | Locale): Locale {
        if (typeof locale === 'object') {
            return locale;
        }

        const cached = CACHE.get(locale);
        if (cached) {
            return cached;
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
        const isoCode = [
            lang.toLowerCase(),
            region?.toUpperCase(),
            script ? toPascalCase(script) : undefined,
        ]
            .filter(isNotUndefined)
            .join('-');

        const obj: Locale = {
            code: isoCode.replace('-', '_'),
            isoCode,
            slug: isoCode.toLowerCase(),
            dir: KNOWN_RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr',
            lang,
            region: region ? region.toUpperCase() : undefined,
            script: script ? toPascalCase(script) : undefined,
        };

        CACHE.set(obj.code, obj);
        CACHE.set(obj.isoCode, obj);
        CACHE.set(obj.slug, obj);

        return obj;
    }

    export function toIsoCode(locale: AnyCode | Locale): HyphenCode {
        return Locale.from(locale).isoCode;
    }

    export function toUnderscoreCode(locale: AnyCode | Locale): UnderscoreCode {
        return Locale.from(locale).code;
    }

    export function toUrlSlug(locale: AnyCode | Locale): UrlSlug {
        return Locale.from(locale).slug;
    }

    export function toNeutralLanguageCode(locale: AnyCode | Locale): LanguageCode {
        return Locale.from(locale).lang;
    }

    export function toRegionCode(locale: AnyCode | Locale): RegionCode | undefined {
        return Locale.from(locale).region;
    }

    export function isRegionCode(
        locale: AnyCode | Locale,
        regionCode: Locale.RegionCode | LowercaseRegionCode,
    ) {
        return Locale.toRegionCode(locale) === regionCode.toUpperCase();
    }

    export function direction(locale: AnyCode | Locale): 'rtl' | 'ltr' {
        return Locale.from(locale).dir;
    }

    export function isLtr(locale: AnyCode | Locale): boolean {
        return Locale.from(locale).dir === 'ltr';
    }

    export function isRtl(locale: AnyCode | Locale): boolean {
        return Locale.from(locale).dir === 'rtl';
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
        return Locale.from(a).lang === Locale.from(b).lang;
    }

    export function isSameRegion(a: Locale | AnyCode, b: Locale | AnyCode): boolean {
        const al = Locale.from(a);
        const bl = Locale.from(b);

        if (!al.region || !bl.region) {
            // It's never the same region, if it's not defined.
            return false;
        }

        return al.region === bl.region;
    }
}

function toPascalCase(input: string) {
    return `${input.substring(0, 1).toUpperCase()}${input.substring(1).toLowerCase()}`;
}
