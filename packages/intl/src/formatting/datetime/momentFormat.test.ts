import { formatWithMomentPattern } from './momentFormat';

describe('formatWithMomentPattern', () => {
    const date = new Date('2024-03-05T07:30:45.000Z');

    test.each([
        ['D/M/YY', '5/3/24'],
        ['M/D/YY', '3/5/24'],
        ['YY/M/D', '24/3/5'],
        ['DD/MM/YYYY', '05/03/2024'],
        ['MM/DD/YYYY', '03/05/2024'],
        ['DD.MM.YYYY', '05.03.2024'],
    ])('formats numeric pattern "%s" as "%s"', (pattern, expected) => {
        expect(formatWithMomentPattern(date, pattern, 'en', 'UTC')).toBe(expected);
    });

    it('formats month abbreviations using the locale', () => {
        expect(formatWithMomentPattern(date, 'MMM D, YYYY', 'en', 'UTC')).toBe('Mar 5, 2024');
    });

    it('formats time in 24-hour mode', () => {
        expect(formatWithMomentPattern(date, 'HH:mm', 'en', 'UTC')).toBe('07:30');
    });

    it('formats time in 12-hour mode with am/pm marker', () => {
        expect(formatWithMomentPattern(date, 'hh:mm a', 'en', 'UTC')).toBe('07:30 am');
    });

    it('respects the provided timezone', () => {
        const lateNight = new Date('2024-03-15T23:30:00.000Z');
        expect(formatWithMomentPattern(lateNight, 'DD/MM/YYYY', 'en', 'Asia/Tokyo')).toBe(
            '16/03/2024',
        );
    });

    describe('CJK month names', () => {
        const sep22 = new Date('2026-09-22T04:00:00.000Z');
        const oct1 = new Date('2026-10-01T04:00:00.000Z');

        test.each([
            ['ja_JP', sep22, '9月 22, 26'],
            ['ja_JP', oct1, '10月 1, 26'],
            ['ko_KR', oct1, '10월 1, 26'],
            ['zh_HK', sep22, '9月 22, 26'],
        ] as const)('keeps the month marker for %s (%s)', (locale, date, expected) => {
            expect(formatWithMomentPattern(date, 'MMM D, YY', locale, 'Asia/Hong_Kong')).toBe(
                expected,
            );
        });
    });
});
