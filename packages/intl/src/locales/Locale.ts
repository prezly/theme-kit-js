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
    lang: Locale.LangCode;

    /**
     * Text direction for the locale.
     */
    direction: 'ltr' | 'rtl';

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
    export type AnySlug = UrlSlug | LangCode | LowercaseRegionCode;

    type LowercaseRegionCode = `${Lowercase<string>}`;

    export type Code =
        | `${LangCode}`
        | `${LangCode}_${RegionCode}`
        | `${LangCode}_${ScriptCode}`
        | `${LangCode}_${ScriptCode}_${RegionCode}`;

    export type IsoCode =
        | `${LangCode}`
        | `${LangCode}-${RegionCode}`
        | `${LangCode}-${ScriptCode}`
        | `${LangCode}-${ScriptCode}-${RegionCode}`;

    export type UrlSlug = string;

    export type LangCode = `${Lowercase<string>}`;
    export type RegionCode = `${Uppercase<string>}`;
    export type ScriptCode = string;

    export function from(locale: AnyCode | Locale): Locale {
        if (typeof locale === 'object') {
            return locale;
        }

        const cached = CACHE.get(locale);
        if (cached) {
            return cached;
        }

        const [lang, ...rest] = locale.toLowerCase().split(/[_-]/g) as [
            LangCode,
            ...(RegionCode | ScriptCode)[],
        ];

        if (!lang.match(LANG_CODE_REGEX)) {
            throw new Error(`Invalid locale code provided: "${locale}".`);
        }

        const scripts = rest.filter((s) => KNOWN_SCRIPTS.includes(s)) as Locale.ScriptCode[];
        const regions = rest
            .filter((s) => !KNOWN_SCRIPTS.includes(s))
            .map((region) => region.toUpperCase()) as Locale.RegionCode[];

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

        const [scriptCode] = scripts as [Locale.ScriptCode | undefined];
        const [regionCode] = regions as [Locale.RegionCode | undefined];
        const code = [
            lang.toLowerCase(),
            regionCode,
            scriptCode ? toPascalCase(scriptCode) : undefined,
        ]
            .filter(isNotUndefined)
            .join('_') as Locale.Code;

        const isoCode = code.replace('_', '-') as IsoCode;

        const obj: Locale = {
            code,
            isoCode,
            slug: isoCode.toLowerCase(),
            direction: KNOWN_RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr',
            lang,
            region: regionCode,
            script: scriptCode ? toPascalCase(scriptCode) : undefined,
        };

        CACHE.set(obj.code, obj);
        CACHE.set(obj.isoCode, obj);
        CACHE.set(obj.slug, obj);

        return obj;
    }

    export function isValid(locale: AnyCode | string): boolean {
        try {
            Locale.from(locale);
        } catch {
            return false;
        }

        return true;
    }

    export function isLanguageCode(locale: AnyCode | Locale, langCode: LangCode): boolean {
        return Locale.from(locale).lang === langCode.toLowerCase();
    }

    export function isRegionCode(
        locale: AnyCode | Locale,
        regionCode: Locale.RegionCode | LowercaseRegionCode,
    ): boolean {
        return Locale.from(locale).region === regionCode.toUpperCase();
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
