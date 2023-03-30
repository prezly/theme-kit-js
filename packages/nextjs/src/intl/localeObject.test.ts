import { LocaleObject } from './localeObject';

it('throws when created from invalid code', () => {
    // @ts-expect-error
    expect(() => new LocaleObject('en_US')).toThrow('Invalid locale code provided!');
    // @ts-expect-error
    expect(() => new LocaleObject('1234')).toThrow('Invalid locale code provided!');
    // @ts-expect-error
    expect(() => new LocaleObject('*!en-US')).toThrow('Invalid locale code provided!');
});

it('throws when created with unsupported code', () => {
    const unsupportedCode = 'unknown-code';
    expect(() => LocaleObject.fromAnyCode(unsupportedCode)).toThrow(
        `Unsupported locale code provided: "${unsupportedCode}"`,
    );
});

it('accepts any valid code type and converts it to hyphen code consistently', () => {
    expect(LocaleObject.fromAnyCode('en').toHyphenCode()).toBe('en');
    expect(LocaleObject.fromAnyCode('en-us').toHyphenCode()).toBe('en-US');
    expect(LocaleObject.fromAnyCode('en-US').toHyphenCode()).toBe('en-US');
    expect(LocaleObject.fromAnyCode('EN-US').toHyphenCode()).toBe('en-US');
    expect(LocaleObject.fromAnyCode('en_us').toHyphenCode()).toBe('en-US');
    expect(LocaleObject.fromAnyCode('en_US').toHyphenCode()).toBe('en-US');
    expect(LocaleObject.fromAnyCode('EN_US').toHyphenCode()).toBe('en-US');

    expect(LocaleObject.fromAnyCode('es-419').toHyphenCode()).toBe('es-419');
    expect(LocaleObject.fromAnyCode('es_419').toHyphenCode()).toBe('es-419');
});

it('converts to underscore code consistently', () => {
    expect(LocaleObject.fromAnyCode('en').toUnderscoreCode()).toBe('en');
    expect(LocaleObject.fromAnyCode('en-us').toUnderscoreCode()).toBe('en_US');
    expect(LocaleObject.fromAnyCode('en-US').toUnderscoreCode()).toBe('en_US');
    expect(LocaleObject.fromAnyCode('EN-US').toUnderscoreCode()).toBe('en_US');
    expect(LocaleObject.fromAnyCode('en_us').toUnderscoreCode()).toBe('en_US');
    expect(LocaleObject.fromAnyCode('en_US').toUnderscoreCode()).toBe('en_US');
    expect(LocaleObject.fromAnyCode('EN_US').toUnderscoreCode()).toBe('en_US');
});

it('converts to URL slug consistently', () => {
    expect(LocaleObject.fromAnyCode('en').toUrlSlug()).toBe('en');
    expect(LocaleObject.fromAnyCode('en-us').toUrlSlug()).toBe('en-us');
    expect(LocaleObject.fromAnyCode('en-US').toUrlSlug()).toBe('en-us');
    expect(LocaleObject.fromAnyCode('EN-US').toUrlSlug()).toBe('en-us');
    expect(LocaleObject.fromAnyCode('en_us').toUrlSlug()).toBe('en-us');
    expect(LocaleObject.fromAnyCode('en_US').toUrlSlug()).toBe('en-us');
    expect(LocaleObject.fromAnyCode('EN_US').toUrlSlug()).toBe('en-us');
});

it('converts to neutral language code consistently', () => {
    expect(LocaleObject.fromAnyCode('en').toNeutralLanguageCode()).toBe('en');
    expect(LocaleObject.fromAnyCode('en-us').toNeutralLanguageCode()).toBe('en');
    expect(LocaleObject.fromAnyCode('en-US').toNeutralLanguageCode()).toBe('en');
    expect(LocaleObject.fromAnyCode('EN-US').toNeutralLanguageCode()).toBe('en');
    expect(LocaleObject.fromAnyCode('en_us').toNeutralLanguageCode()).toBe('en');
    expect(LocaleObject.fromAnyCode('en_US').toNeutralLanguageCode()).toBe('en');
    expect(LocaleObject.fromAnyCode('EN_US').toNeutralLanguageCode()).toBe('en');
});

it('converts to region code consistently', () => {
    expect(LocaleObject.fromAnyCode('en').toRegionCode()).toBe('EN');
    expect(LocaleObject.fromAnyCode('en-us').toRegionCode()).toBe('US');
    expect(LocaleObject.fromAnyCode('en-US').toRegionCode()).toBe('US');
    expect(LocaleObject.fromAnyCode('EN-US').toRegionCode()).toBe('US');
    expect(LocaleObject.fromAnyCode('en_us').toRegionCode()).toBe('US');
    expect(LocaleObject.fromAnyCode('en_US').toRegionCode()).toBe('US');
    expect(LocaleObject.fromAnyCode('EN_US').toRegionCode()).toBe('US');
});

it('can compare two objects', () => {
    const enUsLocale = LocaleObject.fromAnyCode('en-US');
    const enUsLocaleDuplicate = LocaleObject.fromAnyCode('en-US');
    const deDeLocale = LocaleObject.fromAnyCode('de-DE');

    expect(enUsLocale.isEqual(enUsLocaleDuplicate)).toBe(true);
    expect(enUsLocaleDuplicate.isEqual(enUsLocale)).toBe(true);
    expect(enUsLocale.isEqual(deDeLocale)).toBe(false);
    expect(deDeLocale.isEqual(enUsLocale)).toBe(false);
});
