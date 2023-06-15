import type { NextPageContext } from 'next';

import { getNextPrezlyApi } from '../../../data-fetching';

import { createPaths } from './createPaths';
import { SitemapBuilder } from './SitemapBuilder';

function normalizeBaseUrl(baseUrl: string, protocol = 'https') {
    if (
        baseUrl === '/' ||
        baseUrl.startsWith('localhost') ||
        baseUrl.startsWith(`${protocol}://`)
    ) {
        return baseUrl;
    }

    return `${protocol}://${baseUrl}`;
}

export function getSitemapServerSideProps(
    options: { additionalPaths?: string[]; pinning?: boolean } = {},
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
        const stories = await api.getAllStories({
            pinning: options.pinning ?? false,
        });
        const categories = await api.getCategories();

        const paths = createPaths(stories, categories);
        const sitemapBuilder = new SitemapBuilder(baseUrl);

        sitemapBuilder.addUrl('/');
        paths.forEach((path) => sitemapBuilder.addUrl(path));

        options.additionalPaths?.forEach((path) => sitemapBuilder.addUrl(path));

        res.setHeader('Content-Type', 'text/xml');
        res.write(sitemapBuilder.serialize());
        res.end();

        return {
            props: {},
        };
    };
}
