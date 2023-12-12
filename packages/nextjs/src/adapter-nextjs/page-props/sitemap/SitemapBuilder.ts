import { Category } from '@prezly/sdk';
import type { NewsroomLanguageSettings, Story } from '@prezly/sdk';
import { getShortestLocaleCode, getUsedLanguages, LocaleObject } from '@prezly/theme-kit-core';

import type { SitemapUrl } from './types';

export class SitemapBuilder {
    private baseUrl: string;

    private basePath: string | undefined;

    private usedLanguages: NewsroomLanguageSettings[];

    private urls: SitemapUrl[] = [];

    constructor(
        baseUrl: string,
        basePath: string | undefined,
        languages: NewsroomLanguageSettings[],
    ) {
        this.baseUrl = baseUrl;
        this.basePath = basePath;
        // Sort languages to place the default language first
        this.usedLanguages = getUsedLanguages(languages).sort((a, b) => {
            if (a.is_default) return -1;
            if (b.is_default) return 1;
            return 0;
        });
    }

    private buildUrl(location: string, localeCode?: string) {
        const shortestLocaleCode = localeCode
            ? getShortestLocaleCode(this.usedLanguages, LocaleObject.fromAnyCode(localeCode))
            : false;
        const basePart = this.basePath ?? '';
        const localePart = shortestLocaleCode
            ? `/${LocaleObject.fromAnyCode(shortestLocaleCode).toUrlSlug()}`
            : '';
        const finalPart = (basePart || localePart) && location === '/' ? '' : location;

        return this.baseUrl + basePart + localePart + finalPart;
    }

    /**
     * Add a non-dynamic URL to the sitemap (e.g. `/` or `/media`)
     * The URL will be added once for each used locale on the site, with proper locale code part.
     */
    public addPageUrl(url: string) {
        this.usedLanguages.forEach(({ code }) => {
            this.urls.push({
                location: this.buildUrl(url, code),
                changeFrequency: SitemapBuilder.guessFrequency(url),
                priority: SitemapBuilder.guessPriority(url),
            });
        });
    }

    public addStoryUrl(story: Story) {
        const url = `/${story.slug}`;

        this.urls.push({
            location: this.buildUrl(`/${story.slug}`),
            changeFrequency: SitemapBuilder.guessFrequency(url),
            priority: SitemapBuilder.guessPriority(url),
        });
    }

    public addCategoryUrl(category: Category) {
        this.usedLanguages.forEach(({ code }) => {
            const translatedCategory = Category.translation(category, code);
            if (translatedCategory) {
                const url = `/category/${translatedCategory.slug}`;

                this.urls.push({
                    location: this.buildUrl(url, code),
                    changeFrequency: SitemapBuilder.guessFrequency(url),
                    priority: SitemapBuilder.guessPriority(url),
                });
            }
        });
    }

    // TODO: Allow specyfying changeFrequency and priority externally
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
