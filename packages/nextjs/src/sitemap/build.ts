import type { MetadataRoute } from 'next';

import type { Entry } from './types';

interface Options {
    baseUrl: string;
}

export async function build(
    entries: Entry[] | Promise<Entry[]> | Promise<Entry[]>[],
    { baseUrl }: Options,
): Promise<MetadataRoute.Sitemap> {
    const resolved = await (Array.isArray(entries)
        ? Promise.all(entries)
        : Promise.resolve(entries));

    return resolved
        .flat()
        .map((entry) => {
            if (typeof entry === 'string' || typeof entry === 'undefined') {
                return { url: entry };
            }
            return entry;
        })
        .filter((entry): entry is MetadataRoute.Sitemap[number] => Boolean(entry.url))
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
