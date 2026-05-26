import { Locale, supportedLocales } from '../../locales';

import { formatDate, formatTime, getDateFormat, getTimeFormat } from './lib';

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

describe('formatDate', () => {
    const date = new Date('2024-03-15T10:00:00.000Z');

    it('formats using locale defaults when no dateFormat is provided', () => {
        const result = formatDate(date, { locale: 'en', timezone: 'Europe/London' });
        expect(result).toMatch(/March/);
        expect(result).toContain('2024');
    });

    it('formats using a moment-style dateFormat when provided', () => {
        expect(
            formatDate(date, {
                locale: 'en',
                timezone: 'Europe/London',
                dateFormat: 'DD/MM/YYYY',
            }),
        ).toBe('15/03/2024');

        expect(
            formatDate(date, {
                locale: 'en',
                timezone: 'Europe/London',
                dateFormat: 'MMM D, YYYY',
            }),
        ).toBe('Mar 15, 2024');

        expect(
            formatDate(date, {
                locale: 'en',
                timezone: 'Europe/London',
                dateFormat: 'DD.MM.YYYY',
            }),
        ).toBe('15.03.2024');
    });

    it('respects the provided timezone when using a moment-style dateFormat', () => {
        // 2024-03-15 23:30 UTC is already 2024-03-16 in Tokyo
        const lateNight = new Date('2024-03-15T23:30:00.000Z');
        expect(
            formatDate(lateNight, {
                locale: 'en',
                timezone: 'Asia/Tokyo',
                dateFormat: 'DD/MM/YYYY',
            }),
        ).toBe('16/03/2024');
    });
});

describe('formatTime', () => {
    const date = new Date('2024-03-15T10:00:00.000Z');

    it('appends the timezone offset when a moment-style timeFormat is provided', () => {
        const result = formatTime(date, {
            locale: 'en',
            timezone: 'Europe/London',
            timeFormat: 'HH:mm',
        });
        expect(result).toMatch(/^10:00 GMT[+-]\d{2}:\d{2}$/);
    });

    it('supports 12-hour moment-style format', () => {
        const result = formatTime(date, {
            locale: 'en',
            timezone: 'Europe/London',
            timeFormat: 'hh:mm a',
        });
        expect(result).toMatch(/^10:00 (am|AM) GMT[+-]\d{2}:\d{2}$/);
    });
});
