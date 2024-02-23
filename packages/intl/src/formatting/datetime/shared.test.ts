import { toDate } from './shared';

describe('toDate', () => {
    it('should keep Date object as is', () => {
        const now = new Date();
        expect(toDate(now)).toBe(now);
    });

    it('should convert string values to date', () => {
        expect(toDate('2000-01-01T00:00:00Z')).toEqual(new Date('2000-01-01T00:00:00Z'));
    });

    it('should treat numeric values as UNIX timestamp in seconds', () => {
        expect(toDate(946684865)).toEqual(new Date('2000-01-01T00:01:05Z'));
    });
});
