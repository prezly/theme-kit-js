import type { Newsroom } from '@prezly/sdk';
import type { MetadataRoute } from 'next';

import type { AsyncResolvable } from '../utils';
import { resolveAsync } from '../utils';

export interface Context {
    newsroom: AsyncResolvable<Newsroom>;
    baseUrl: string;
}

type DisallowList = { disallow: string[] };

export async function generate(
    { baseUrl, ...resolvable }: Context,
    extra: MetadataRoute.Robots | DisallowList = { rules: [] },
): Promise<MetadataRoute.Robots> {
    const newsroom = await resolveAsync(resolvable.newsroom);

    if (!newsroom.is_indexable) {
        return {
            rules: [{ userAgent: '*', disallow: '/' }],
        };
    }

    const sitemap = `${baseUrl}sitemap.xml`;

    if ('disallow' in extra) {
        return {
            sitemap,
            rules: [
                {
                    userAgent: '*',
                    disallow: extra.disallow,
                },
            ],
        };
    }

    return { sitemap, ...extra };
}
