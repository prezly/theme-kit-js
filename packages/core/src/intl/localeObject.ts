import localeConfig from './localeConfig';

/**
 * This class is created to simplify working with locales and transforming between different locale code formats.
 * Prezly API uses underscore-codes, while most frontend application tend to use hyphen-codes or slugs.
 * Note that `fromAnyCode` constructor only accepts locales supported by Prezly backend. See `localeConfig` for reference.
 */
export class LocaleObject {
    /**
     * Hyphen-separated locale code.
     * Examples: `nl-BE`, `en-US`, `fr`, `fil`
     */
    private localeCode: string;

    /**
     * Whether the locale is region independent (without region/culture part).
     * I.E. `en` is region independent, while `en-US` is not.
     */
    public isRegionIndependent: boolean;

    private constructor(localeCode: string) {
        if (!/^([a-z]{2,3})(-[a-z\d]{1,4})?$/i.test(localeCode)) {
            throw new Error(`Invalid locale code provided: "${localeCode}"`);
        }

        const [language, region] = localeCode.split('-');

        if (region) {
            this.isRegionIndependent = false;
            // Workaround for `zh-Hant` locale, which is the only locale with non-uppercase region part
            const regionSuffix = region === 'hant' ? 'Hant' : region.toUpperCase();

            this.localeCode = [language, regionSuffix].join('-');
        } else {
            this.isRegionIndependent = true;
            this.localeCode = language;
        }
    }

    /**
     * @param localeCode Locale code in any of the formats below.
     * Examples:
     * - Hyphen-codes: `nl-BE`, `en-US`, `fr`, `fil`
     * - Underscore-codes: `nl_BE`, `en_US`, `fr`, `fil`
     * - Slugs: `nl-be`, `en-us`, `fr`, `fil`
     */
    public static fromAnyCode(localeCode: string): LocaleObject {
        const lowercaseCode = localeCode.toLowerCase().replace('_', '-');
        const foundCode = localeConfig.find((code) => code === lowercaseCode);

        if (!foundCode) {
            throw new Error(`Unsupported locale code provided: "${lowercaseCode}"`);
        }

        return new LocaleObject(foundCode);
    }

    /**
     * @returns Code formatted into hyphen format: `nl-BE`, `en-US`, `fr`, `fil`
     */
    public toHyphenCode(): string {
        return this.localeCode;
    }

    /**
     * @returns Code formatted into underscore format, as expected by Prezly API: `nl_BE`, `en_US`, `fr`, `fil`
     */
    public toUnderscoreCode(): string {
        return this.localeCode.replace('-', '_');
    }

    /**
     * @returns Code formatted to a URL-friendly lowercase slug format: `nl-be`, `en-us`, `fr`, `fil`
     */
    public toUrlSlug(): string {
        return this.localeCode.toLowerCase();
    }

    /**
     * @returns Only the language part of the code without culture/region part: `nl`, `en`, `fr`
     */
    public toNeutralLanguageCode(): string {
        const [language] = this.localeCode.split('-');

        return language;
    }

    /**
     * @returns Only the culture/regtion part without the language part: `be`, `us`, `fr`
     */
    public toRegionCode(): string {
        const [language, region] = this.localeCode.split('-');

        if (!region) {
            return language.toUpperCase();
        }

        return region.toUpperCase();
    }

    /**
     * Check if two LocaleObject instances are representing the same locale code.
     */
    public isEqual(anotherLocale: LocaleObject) {
        return anotherLocale.toHyphenCode() === this.localeCode;
    }
}
