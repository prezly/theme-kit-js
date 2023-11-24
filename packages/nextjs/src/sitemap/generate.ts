/* eslint-disable @typescript-eslint/no-use-before-define */
import { Category, type Newsroom, type Story } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';
import type { MetadataRoute } from 'next';

import type { AsyncResolvable } from '../utils';
import { resolveAsync } from '../utils';

import { build } from './build';
import type {
    AppUrlGenerator,
    ChangeFrequency,
    ChangeFrequencyFn,
    Priority,
    PriorityFn,
} from './types';

export interface Options {
    baseUrl: string;
    changeFrequency?: ChangeFrequencyFn;
    priority?: PriorityFn;
}

export interface Context {
    locales: AsyncResolvable<Locale.Code[]>;
    newsroom: AsyncResolvable<Newsroom>;
    stories: AsyncResolvable<Story[]>;
    categories: AsyncResolvable<Category[]>;
    generateUrl: AppUrlGenerator;
}

export async function generate(
    { generateUrl, ...resolvable }: Context,
    { baseUrl, priority = guessPriority, changeFrequency = guessChangeFrequency }: Options,
): Promise<MetadataRoute.Sitemap> {
    const [locales, newsroom] = await resolveAsync(resolvable.locales, resolvable.newsroom);

    async function generateHomepageEntries() {
        return locales.map((localeCode) => ({
            url: generateUrl('index', { localeCode }),
            priority: priority('index', { localeCode }),
            changeFrequency: changeFrequency('index', { localeCode }),
        }));
    }

    async function generateStoriesEntries() {
        const stories = await resolveAsync(resolvable.stories);

        return stories.map((story) => {
            const params = { ...story, localeCode: story.culture.code };
            return {
                url: generateUrl('story', params),
                priority: priority('story', params),
                changeFrequency: changeFrequency('story', params),
            };
        });
    }

    async function generateCategoriesEntries() {
        const categories = await resolveAsync(resolvable.categories);

        return categories.flatMap((category) =>
            Category.translations(category)
                .filter(({ locale }) => locales.includes(locale))
                .map((translation) => {
                    const params = { ...translation, localeCode: translation.locale };

                    return {
                        url: generateUrl('category', params),
                        priority: priority('category', params),
                        changeFrequency: changeFrequency('category', params),
                    };
                }),
        );
    }

    async function generateMediaEntries() {
        if (newsroom.public_galleries_number === 0) return [];

        return locales.map((localeCode) => ({
            url: generateUrl('media', { localeCode }),
            priority: priority('media', { localeCode }),
            changeFrequency: changeFrequency('media', { localeCode }),
        }));
    }

    return build(
        [
            generateHomepageEntries(),
            generateStoriesEntries(),
            generateCategoriesEntries(),
            generateMediaEntries(),
        ],
        { baseUrl },
    );
}

export function guessChangeFrequency(
    routeName: 'index' | 'category' | 'story' | 'media',
): ChangeFrequency {
    if (routeName === 'index') return 'daily';
    return 'weekly';
}

export function guessPriority(routeName: 'index' | 'category' | 'story' | 'media'): Priority {
    if (routeName === 'index') return 0.9;
    if (routeName === 'category') return 0.8;
    return 0.7;
}
