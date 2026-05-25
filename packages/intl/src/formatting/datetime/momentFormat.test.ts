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

    it('preserves text wrapped in square brackets as a literal', () => {
        expect(formatWithMomentPattern(date, '[Year:] YYYY', 'en', 'UTC')).toBe('Year: 2024');
    });
});
