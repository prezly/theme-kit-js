import { Locale } from './Locale';
import { supportedLocales } from './supportedLocales';

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

    it('should accept valid codes', () => {
        expect(() => Locale.from('en')).not.toThrow();
        expect(() => Locale.from('en-us')).not.toThrow();
        expect(() => Locale.from('en-US')).not.toThrow();
        expect(() => Locale.from('EN-US')).not.toThrow();
        expect(() => Locale.from('en_us')).not.toThrow();
        expect(() => Locale.from('en_US')).not.toThrow();
        expect(() => Locale.from('EN_US')).not.toThrow();

        expect(() => Locale.from('zh-Hant')).not.toThrow();
        expect(() => Locale.from('zh-Hans')).not.toThrow();

        expect(() => Locale.from('es-419')).not.toThrow();
        expect(() => Locale.from('es_419')).not.toThrow();
    });

    it('should cache created locale objects', () => {
        expect(Locale.from('en_US')).toBe(Locale.from('en-us'));
    });

    it('should provide underscore code', () => {
        expect(Locale.from('en').code).toBe('en');
        expect(Locale.from('en-us').code).toBe('en_US');
        expect(Locale.from('en-US').code).toBe('en_US');
        expect(Locale.from('EN-US').code).toBe('en_US');
        expect(Locale.from('en_us').code).toBe('en_US');
        expect(Locale.from('en_US').code).toBe('en_US');
        expect(Locale.from('EN_US').code).toBe('en_US');
    });

    it('should provide ISO code', () => {
        expect(Locale.from('en').isoCode).toBe('en');
        expect(Locale.from('en-us').isoCode).toBe('en-US');
        expect(Locale.from('en-US').isoCode).toBe('en-US');
        expect(Locale.from('EN-US').isoCode).toBe('en-US');
        expect(Locale.from('en_us').isoCode).toBe('en-US');
        expect(Locale.from('en_US').isoCode).toBe('en-US');
        expect(Locale.from('EN_US').isoCode).toBe('en-US');
    });

    it('should provide URL slug', () => {
        expect(Locale.from('en').slug).toBe('en');
        expect(Locale.from('en-us').slug).toBe('en-us');
        expect(Locale.from('en-US').slug).toBe('en-us');
        expect(Locale.from('EN-US').slug).toBe('en-us');
        expect(Locale.from('en_us').slug).toBe('en-us');
        expect(Locale.from('en_US').slug).toBe('en-us');
        expect(Locale.from('EN_US').slug).toBe('en-us');
    });

    it('should provide language code', () => {
        expect(Locale.from('en').lang).toBe('en');
        expect(Locale.from('en-us').lang).toBe('en');
        expect(Locale.from('en-US').lang).toBe('en');
        expect(Locale.from('EN-US').lang).toBe('en');
        expect(Locale.from('en_us').lang).toBe('en');
        expect(Locale.from('en_US').lang).toBe('en');
        expect(Locale.from('EN_US').lang).toBe('en');
    });

    it('should provide region code', () => {
        expect(Locale.from('en').region).toBe(undefined);
        expect(Locale.from('en-us').region).toBe('US');
        expect(Locale.from('en-US').region).toBe('US');
        expect(Locale.from('EN-US').region).toBe('US');
        expect(Locale.from('en_us').region).toBe('US');
        expect(Locale.from('en_US').region).toBe('US');
        expect(Locale.from('EN_US').region).toBe('US');
    });

    it('should check if two locales are equal', () => {
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
        expect(Locale.isEqual('en_US', Locale.from('en_US'))).toBe(true);
    });

    it('should check if two locales are of the same language', () => {
        expect(Locale.isSameLang(Locale.from('en-US'), Locale.from('en-GB'))).toBe(true);
        expect(Locale.isSameLang('en-US', Locale.from('en-GB'))).toBe(true);
        expect(Locale.isSameLang('en-us', 'en_GB')).toBe(true);
        expect(Locale.isSameLang('en-FR', 'en')).toBe(true);

        expect(Locale.isSameLang('zh_Hant', 'zh_Hans')).toBe(true);

        expect(Locale.isSameLang('en_US', 'de_DE')).toBe(false);
        expect(Locale.isSameLang('en_US', 'fr')).toBe(false);
    });

    it('should check if two locales are of the same region', () => {
        expect(Locale.isSameRegion(Locale.from('en-US'), Locale.from('es-US'))).toBe(true);
        expect(Locale.isSameRegion('en-US', Locale.from('es-US'))).toBe(true);
        expect(Locale.isSameRegion('en-us', 'es_US')).toBe(true);

        // Region-independent locales (with no region) are never considered of the same region.
        expect(Locale.isSameRegion('en', 'en')).toBe(false);

        expect(Locale.isSameRegion('en-US', 'es_ES')).toBe(false);
        expect(Locale.isSameRegion('en_US', 'de_DE')).toBe(false);
        expect(Locale.isSameRegion('en_US', 'fr')).toBe(false);
    });

    it('should tell language direction', () => {
        expect(Locale.from('ar_AR').direction).toBe('rtl');
        expect(Locale.from('he').direction).toBe('rtl');
        expect(Locale.from('ur-pk').direction).toBe('rtl');

        expect(Locale.from('en_GB').direction).toBe('ltr');
        expect(Locale.from('fr').direction).toBe('ltr');
        expect(Locale.from('zh_Hant').direction).toBe('ltr');
    });

    it('should work for all supported locales', () => {
        supportedLocales.forEach((code) => {
            expect(() => Locale.from(code)).not.toThrow();
        });
    });
});
