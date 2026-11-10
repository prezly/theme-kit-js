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
    describe('with a Newsroom date format in Asia/Hong_Kong', () => {
        const timezone = 'Asia/Hong_Kong';
        const sep22 = new Date('2026-09-22T04:00:00.000Z');
        const oct1 = new Date('2026-10-01T04:00:00.000Z');

        test.each([
            ['en', 'MMM D, YY', sep22, 'Sep 22, 26'],
            ['en', 'MMM D, YY', oct1, 'Oct 1, 26'],
            ['en', 'DD/MM/YYYY', sep22, '22/09/2026'],
            ['en', 'DD/MM/YYYY', oct1, '01/10/2026'],
        ] as const)(
            'applies the pattern for %s: "%s" on %s',
            (locale, dateFormat, date, expected) => {
                expect(formatDate(date, { locale, timezone, dateFormat })).toBe(expected);
            },
        );

        test.each([
            ['zh_HK', sep22, '2026年9月22日'],
            ['zh_HK', oct1, '2026年10月1日'],
            ['ja_JP', sep22, '2026年9月22日'],
            ['ja_JP', oct1, '2026年10月1日'],
            ['ko_KR', sep22, '2026년 9월 22일'],
            ['ko_KR', oct1, '2026년 10월 1일'],
        ] as const)('falls back to the native long date for %s on %s', (locale, date, expected) => {
            for (const dateFormat of ['MMM D, YY', 'DD/MM/YYYY']) {
                expect(formatDate(date, { locale, timezone, dateFormat })).toBe(expected);
            }
        });
    });

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

    // On 2024-03-15 Europe/London is at a zero UTC offset (pre-DST). The numeric offset is
    // optional in these patterns because `timeZoneName: 'longOffset'` renders a zero offset as
    // bare "GMT" on ICU >= 72 (Node >= 20) but as "GMT+00:00" on older ICU — both are valid.
    it('appends the timezone offset when a moment-style timeFormat is provided', () => {
        const result = formatTime(date, {
            locale: 'en',
            timezone: 'Europe/London',
            timeFormat: 'HH:mm',
        });
        expect(result).toMatch(/^10:00 GMT(?:[+-]\d{2}:\d{2})?$/);
    });

    it('supports 12-hour moment-style format', () => {
        const result = formatTime(date, {
            locale: 'en',
            timezone: 'Europe/London',
            timeFormat: 'hh:mm a',
        });
        expect(result).toMatch(/^10:00 (am|AM) GMT(?:[+-]\d{2}:\d{2})?$/);
    });
});
