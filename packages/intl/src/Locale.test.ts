import { Locale } from './Locale';
import { locales } from './locales';

describe('Locale', () => {
    it('should throw when created from invalid code', () => {
        expect(() => Locale.from('1234')).toThrow('Invalid locale code provided: "1234".');

        expect(() => Locale.from('*!en-US')).toThrow('Invalid locale code provided: "*!en-US".');

        expect(() => Locale.from('zh-Hant-Hans')).toThrow(
            'Unable to parse the provided locale code: "zh-Hant-Hans". Multiple script codes detected.',
        );
        expect(() => Locale.from('en_US_GB')).toThrow(
            'Unable to parse the provided locale code: "en_US_GB". Multiple region codes detected.',
        );
    });

    it('should accept any valid code', () => {
        expect(Locale.from('en')).toEqual({ lang: 'en', region: undefined, script: undefined });
        expect(Locale.from('en-us')).toEqual({ lang: 'en', region: 'US', script: undefined });
        expect(Locale.from('en-US')).toEqual({ lang: 'en', region: 'US', script: undefined });
        expect(Locale.from('EN-US')).toEqual({ lang: 'en', region: 'US', script: undefined });
        expect(Locale.from('en_us')).toEqual({ lang: 'en', region: 'US', script: undefined });
        expect(Locale.from('en_US')).toEqual({ lang: 'en', region: 'US', script: undefined });
        expect(Locale.from('EN_US')).toEqual({ lang: 'en', region: 'US', script: undefined });

        expect(Locale.from('zh-Hant')).toEqual({ lang: 'zh', region: undefined, script: 'Hant' });
        expect(Locale.from('zh-Hans')).toEqual({ lang: 'zh', region: undefined, script: 'Hans' });

        expect(Locale.from('es-419')).toEqual({ lang: 'es', region: '419', script: undefined });
        expect(Locale.from('es_419')).toEqual({ lang: 'es', region: '419', script: undefined });
    });

    it('should get hyphen code consistently', () => {
        expect(Locale.toHyphenCode('en')).toBe('en');
        expect(Locale.toHyphenCode('en-us')).toBe('en-US');
        expect(Locale.toHyphenCode('en-US')).toBe('en-US');
        expect(Locale.toHyphenCode('EN-US')).toBe('en-US');
        expect(Locale.toHyphenCode('en_us')).toBe('en-US');
        expect(Locale.toHyphenCode('en_US')).toBe('en-US');
        expect(Locale.toHyphenCode('EN_US')).toBe('en-US');
    });

    it('should get underscore code consistently', () => {
        expect(Locale.toUnderscoreCode('en')).toBe('en');
        expect(Locale.toUnderscoreCode('en-us')).toBe('en_US');
        expect(Locale.toUnderscoreCode('en-US')).toBe('en_US');
        expect(Locale.toUnderscoreCode('EN-US')).toBe('en_US');
        expect(Locale.toUnderscoreCode('en_us')).toBe('en_US');
        expect(Locale.toUnderscoreCode('en_US')).toBe('en_US');
        expect(Locale.toUnderscoreCode('EN_US')).toBe('en_US');
    });

    it('should get URL slug consistently', () => {
        expect(Locale.toUrlSlug('en')).toBe('en');
        expect(Locale.toUrlSlug('en-us')).toBe('en-us');
        expect(Locale.toUrlSlug('en-US')).toBe('en-us');
        expect(Locale.toUrlSlug('EN-US')).toBe('en-us');
        expect(Locale.toUrlSlug('en_us')).toBe('en-us');
        expect(Locale.toUrlSlug('en_US')).toBe('en-us');
        expect(Locale.toUrlSlug('EN_US')).toBe('en-us');
    });

    it('should get neutral language code consistently', () => {
        expect(Locale.toNeutralLanguageCode('en')).toBe('en');
        expect(Locale.toNeutralLanguageCode('en-us')).toBe('en');
        expect(Locale.toNeutralLanguageCode('en-US')).toBe('en');
        expect(Locale.toNeutralLanguageCode('EN-US')).toBe('en');
        expect(Locale.toNeutralLanguageCode('en_us')).toBe('en');
        expect(Locale.toNeutralLanguageCode('en_US')).toBe('en');
        expect(Locale.toNeutralLanguageCode('EN_US')).toBe('en');
    });

    it('should get region code consistently', () => {
        expect(Locale.toRegionCode('en')).toBe(undefined);
        expect(Locale.toRegionCode('en-us')).toBe('US');
        expect(Locale.toRegionCode('en-US')).toBe('US');
        expect(Locale.toRegionCode('EN-US')).toBe('US');
        expect(Locale.toRegionCode('en_us')).toBe('US');
        expect(Locale.toRegionCode('en_US')).toBe('US');
        expect(Locale.toRegionCode('EN_US')).toBe('US');
    });

    it('should check if two locales are equal supporting multiple input formats', () => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const en_US = Locale.from('en-US');
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const en_US2 = Locale.from('en-US');
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const de_DE = Locale.from('de-DE');

        expect(Locale.isEqual(en_US, en_US2)).toBe(true);
        expect(Locale.isEqual(en_US2, en_US)).toBe(true);
        expect(Locale.isEqual(en_US, de_DE)).toBe(false);
        expect(Locale.isEqual(de_DE, en_US)).toBe(false);

        expect(Locale.isEqual('en_US', 'en-us')).toBe(true);
        expect(Locale.isEqual('en_US', { lang: 'en', region: 'US', script: undefined })).toBe(true);
    });

    it('should tell if it is an RTL language', () => {
        expect(Locale.isRtl('ar_AR')).toBe(true);
        expect(Locale.isRtl('he')).toBe(true);
        expect(Locale.isRtl('ur-pk')).toBe(true);

        expect(Locale.isRtl('en_GB')).toBe(false);
        expect(Locale.isRtl('fr')).toBe(false);
        expect(Locale.isRtl('zh_Hant')).toBe(false);
    });

    it('should tell if it is an LTR language', () => {
        expect(Locale.isLtr('ar_AR')).toBe(false);
        expect(Locale.isLtr('he')).toBe(false);
        expect(Locale.isLtr('ur-pk')).toBe(false);

        expect(Locale.isLtr('en_GB')).toBe(true);
        expect(Locale.isLtr('fr')).toBe(true);
        expect(Locale.isLtr('zh_Hant')).toBe(true);
    });

    it('should tell language direction', () => {
        expect(Locale.direction('ar_AR')).toBe('rtl');
        expect(Locale.direction('he')).toBe('rtl');
        expect(Locale.direction('ur-pk')).toBe('rtl');

        expect(Locale.direction('en_GB')).toBe('ltr');
        expect(Locale.direction('fr')).toBe('ltr');
        expect(Locale.direction('zh_Hant')).toBe('ltr');
    });

    it('should work for all supported locales', () => {
        locales.forEach((code) => {
            expect(() => Locale.from(code)).not.toThrow();
        });
    });
});
