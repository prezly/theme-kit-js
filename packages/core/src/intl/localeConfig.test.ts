import localeConfig from './localeConfig';

describe('localeConfig', () => {
    it('should have all possible permutations of locale, language and region codes', () => {
        expect(localeConfig).toMatchSnapshot();
    });
});
