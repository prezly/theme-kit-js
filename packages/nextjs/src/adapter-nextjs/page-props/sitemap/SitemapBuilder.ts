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
                alternateLinks: this.usedLanguages.map((language) => ({
                    href: this.buildUrl(url, language.code),
                    lang: LocaleObject.fromAnyCode(language.code).toUrlSlug(),
                })),
            });
        });
    }

    public addStoryUrl(story: Story) {
        const url = `/${story.slug}`;

        // De-dupe translations and only include locales that are enabled on the site
        const translationsMap = story.translations.reduce((map, translation) => {
            if (
                this.usedLanguages.some(({ code }) => code === translation.culture.code) &&
                translation.status === 'published'
            ) {
                map.set(translation.culture.code, translation);
            }

            return map;
        }, new Map());
        // Include the original story to display it in alternate links
        translationsMap.set(story.culture.code, story);
        const translations = Array.from(translationsMap.values());

        this.urls.push({
            location: this.buildUrl(`/${story.slug}`),
            changeFrequency: SitemapBuilder.guessFrequency(url),
            priority: SitemapBuilder.guessPriority(url),
            ...(translations.length > 1 && {
                alternateLinks: translations.map((translatedStory) => ({
                    href: this.buildUrl(`/${translatedStory.slug}`),
                    lang: LocaleObject.fromAnyCode(translatedStory.culture.code).toUrlSlug(),
                })),
            }),
        });
    }

    public addCategoryUrl(category: Category) {
        // De-dupe translations and only include locales that are enabled on the site
        const translationsMap = Object.values(category.i18n).reduce((map, translation) => {
            if (this.usedLanguages.some(({ code }) => code === translation.locale.code)) {
                map.set(translation.locale.code, translation);
            }

            return map;
        }, new Map());
        const translations = Array.from(translationsMap.values());

        this.usedLanguages.forEach(({ code }) => {
            const translatedCategory = Category.translation(category, code);
            if (translatedCategory) {
                const url = `/category/${translatedCategory.slug}`;

                this.urls.push({
                    location: this.buildUrl(url, code),
                    changeFrequency: SitemapBuilder.guessFrequency(url),
                    priority: SitemapBuilder.guessPriority(url),
                    ...(translations.length > 1 && {
                        alternateLinks: translations.map((translation) => ({
                            href: this.buildUrl(
                                `/category/${translation.slug}`,
                                translation.locale.code,
                            ),
                            lang: LocaleObject.fromAnyCode(translation.locale.code).toUrlSlug(),
                        })),
                    }),
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
            url.alternateLinks?.map(
                ({ lang, href }) =>
                    `\t<xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`,
            ),
            '</url>',
        ]
            .filter(Boolean)
            .join('\n');
    }

    serialize() {
        return [
            '<?xml version="1.0" encoding="UTF-8" ?>',
            '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.w3.org/TR/xhtml11/xhtml11_schema.html http://www.w3.org/2002/08/xhtml/xhtml1-strict.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/TR/xhtml11/xhtml11_schema.html">',
            this.urls.map(SitemapBuilder.serializeLocation).join('\n'),
            '</urlset>',
        ].join('\n');
    }
}
