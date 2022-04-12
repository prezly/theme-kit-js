import type { SitemapUrl } from './types';

export class SitemapBuilder {
    private baseUrl: string;

    private urls: SitemapUrl[] = [];

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    public addUrl(loc: string) {
        this.urls.push({
            loc: this.baseUrl + loc,
            changefreq: SitemapBuilder.guessFrequency(loc),
            priority: SitemapBuilder.guessPriority(loc),
        });
    }

    private static guessFrequency(loc: string) {
        if (loc === '/') return 'daily';

        return 'weekly';
    }

    private static guessPriority(loc: string) {
        if (loc === '/') return '0.9';

        if (loc.startsWith('/category/')) {
            return '0.8';
        }

        return '0.7';
    }

    static serializeLoc(url: SitemapUrl) {
        return [
            '<url>',
            url.loc && `\t<loc>${url.loc}</loc>`,
            url.changefreq && `\t<changefreq>${url.changefreq}</changefreq>`,
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
            this.urls.map(SitemapBuilder.serializeLoc).join('\n'),
            '</urlset>',
        ].join('\n');
    }
}
