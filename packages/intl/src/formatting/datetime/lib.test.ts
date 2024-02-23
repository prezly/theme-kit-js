import { Locale, supportedLocales } from '../../locales';

import { getDateFormat, getTimeFormat } from './lib';

describe('getDateFormat', () => {
    test.each(supportedLocales)(
        'should be safe to use with any of the supported locales: %s',
        (locale) => {
            expect(getDateFormat(Locale.from(locale).code, 'Europe/London')).toBeInstanceOf(
                Intl.DateTimeFormat,
            );
        },
    );
});

describe('getTimeFormat', () => {
    test.each(supportedLocales)(
        'should be safe to use with any of the supported locales: %s',
        (locale) => {
            expect(getTimeFormat(Locale.from(locale).code, 'Europe/London')).toBeInstanceOf(
                Intl.DateTimeFormat,
            );
        },
    );
});
