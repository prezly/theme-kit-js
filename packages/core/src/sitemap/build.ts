import { isNotUndefined } from '@technically/is-not-undefined';

import type { Entry, SitemapFile, SitemapFileEntry } from './types';

interface Options {
    baseUrl: string;
}

export async function build(
    entries: Entry[] | Promise<Entry[]> | Promise<Entry[]>[],
    { baseUrl }: Options,
): Promise<SitemapFile> {
    const resolved = await (Array.isArray(entries)
        ? Promise.all(entries)
        : Promise.resolve(entries));

    return resolved
        .flat()
        .map((entry): SitemapFileEntry | undefined => {
            if (!entry) {
                return undefined;
            }
            if (typeof entry === 'string') {
                return { url: entry };
            }
            if (entry.url) {
                return entry as Partial<SitemapFileEntry> & { url: string };
            }
            return undefined;
        })
        .filter(isNotUndefined)
        .map((entry) => {
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
