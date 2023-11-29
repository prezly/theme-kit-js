import type { Newsroom } from '@prezly/sdk';
import { AsyncResolvable } from '@prezly/theme-kit-core';
import type { MetadataRoute } from 'next';

export interface Context {
    newsroom: AsyncResolvable<Newsroom>;
    baseUrl: string;
}

type DisallowList = { disallow: string[] };

export async function generate(
    { baseUrl, ...resolvable }: Context,
    extra: MetadataRoute.Robots | DisallowList = { rules: [] },
): Promise<MetadataRoute.Robots> {
    const newsroom = await AsyncResolvable.resolve(resolvable.newsroom);

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
