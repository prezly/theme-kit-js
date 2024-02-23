export function withCache<P extends any[], T extends any>(fn: (...args: P) => T) {
    const CACHE = new Map<string, T>();

    return (...args: P) => {
        const key = JSON.stringify(args);
        const cached = CACHE.get(key);
        if (cached) return cached;

        const value = fn(...args);
        CACHE.set(key, value);
        return value;
    };
}
