import type { SitemapFile, SitemapFileEntry } from './types';

interface Options {
    baseUrl: string;
}

export async function build(
    entries: SitemapFileEntry[] | Promise<SitemapFileEntry[]> | Promise<SitemapFileEntry[]>[],
    { baseUrl }: Options,
): Promise<SitemapFile> {
    const resolved = await (Array.isArray(entries)
        ? Promise.all(entries)
        : Promise.resolve(entries));

    return resolved.flat().map((entry) => {
        if (
            entry.url.startsWith('https://') ||
            entry.url.startsWith('http://') ||
            entry.url.startsWith('//')
        ) {
            return entry;
        }
        return { ...entry, url: `${baseUrl}${entry.url}` };
    });
}
