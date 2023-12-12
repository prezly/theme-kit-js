import { getAlgoliaSettings } from '@prezly/theme-kit-core/server';
import type { NextPageContext } from 'next';

import { getNextPrezlyApi } from '../../../data-fetching';

import { SitemapBuilder } from './SitemapBuilder';

function normalizeBaseUrl(baseUrl: string, protocol = 'https') {
    // This regex pattern matches if the `baseUrl`
    // equals `/`, starts with `localhost`, or starts with `http://` or `https://`.
    if (/^(\/|localhost|https?:\/\/)/.test(baseUrl)) {
        return baseUrl;
    }

    // If it's explicitly defined to be `http` only
    if (protocol.toLowerCase() === 'http') {
        return `http://${baseUrl}`;
    }

    // Prefer https if protocol is `https,http` or `https` or any other unknown value
    return `https://${baseUrl}`;
}

export function getSitemapServerSideProps(
    options: {
        additionalPaths?: string[];
        basePath?: string;
        /**
         * @deprecated Story Pinning will always be enabled in the next major release.
         */
        pinning?: boolean;
    } = {},
) {
    return async function getServerSideProps(ctx: NextPageContext) {
        const { res, req } = ctx;

        if (!req || !res) {
            // client side
            return {
                props: {},
            };
        }

        const baseUrl = normalizeBaseUrl(
            req.headers.host || '/',
            req.headers['x-forwarded-proto'] as string | undefined,
        );

        const api = getNextPrezlyApi(req);
        const { ALGOLIA_API_KEY } = getAlgoliaSettings(req);
        const [newsroom, languages, stories, categories] = await Promise.all([
            api.getNewsroom(),
            api.getNewsroomLanguages(),
            api.getAllStories({
                pinning: options.pinning ?? true,
            }),
            api.getCategories(),
        ]);

        const sitemapBuilder = new SitemapBuilder(
            baseUrl,
            options.basePath || process.env.NEXT_PUBLIC_BASE_PATH,
            languages,
        );

        sitemapBuilder.addPageUrl('/');
        if (ALGOLIA_API_KEY) {
            sitemapBuilder.addPageUrl('/search');
        }
        if (newsroom.public_galleries_number > 0) {
            sitemapBuilder.addPageUrl('/media');
            const { galleries } = await api.getGalleries({});
            galleries.forEach(({ uuid }) => sitemapBuilder.addPageUrl(`/media/album/${uuid}`));
        }
        categories.forEach((category) => sitemapBuilder.addCategoryUrl(category));
        stories.forEach((story) => sitemapBuilder.addStoryUrl(story));

        options.additionalPaths?.forEach((path) => sitemapBuilder.addPageUrl(path));

        res.setHeader('Content-Type', 'text/xml');
        res.write(sitemapBuilder.serialize());
        res.end();

        return {
            props: {},
        };
    };
}
