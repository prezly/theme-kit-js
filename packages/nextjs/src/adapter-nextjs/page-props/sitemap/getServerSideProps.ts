import type { NextPageContext } from 'next';

import { NextContentDelivery } from '../../../data-fetching';

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

        const api = NextContentDelivery.initClient(req);
        const [newsroom, languages, stories, categories] = await Promise.all([
            api.getNewsroom(),
            api.getNewsroomLanguages(),
            api.allStories(),
            api.categories(),
        ]);

        const sitemapBuilder = new SitemapBuilder(
            baseUrl,
            options.basePath || process.env.NEXT_PUBLIC_BASE_PATH,
            languages,
        );

        sitemapBuilder.addPageUrl('/');
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
