import type { SitemapUrl } from './types';

export class SitemapBuilder {
    private baseUrl: string;

    private urls: SitemapUrl[] = [];

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    public addUrl(location: string) {
        this.urls.push({
            location: this.baseUrl + location,
            changeFrequency: SitemapBuilder.guessFrequency(location),
            priority: SitemapBuilder.guessPriority(location),
        });
    }

    private static guessFrequency(location: string) {
        if (location === '/') return 'daily';

        return 'weekly';
    }

    private static guessPriority(location: string) {
        if (location === '/') return '0.9';

        if (location.startsWith('/category/')) {
            return '0.8';
        }

        return '0.7';
    }

    static serializeLocation(url: SitemapUrl) {
        return [
            '<url>',
            url.location && `\t<loc>${url.location}</loc>`,
            url.changeFrequency && `\t<changefreq>${url.changeFrequency}</changefreq>`,
            url.priority && `\t<priority>${url.priority}</priority>`,
            '</url>',
        ]
            .filter(Boolean)
            .join('\n');
    }

    serialize() {
        return [
            '<?xml version="1.0" encoding="UTF-8" ?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
            this.urls.map(SitemapBuilder.serializeLocation).join('\n'),
            '</urlset>',
        ].join('\n');
    }
}
