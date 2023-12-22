/* eslint-disable @typescript-eslint/no-use-before-define */
import { Category } from '@prezly/sdk';
import type { Newsroom, Story } from '@prezly/sdk';
import { Locale } from '@prezly/theme-kit-intl';

import { AsyncResolvable } from '../resolvable';

import { build } from './build';
import type {
    AppUrlGenerator,
    ChangeFrequency,
    ChangeFrequencyFn,
    Priority,
    PriorityFn,
    SitemapFile,
    SitemapFileEntry,
} from './types';

type SitemapFileEntryWithLocale = SitemapFileEntry & { locale: Locale.Code };

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

export async function generate(context: Context, options: Options): Promise<SitemapFile> {
    return build(
        [
            generateHomepageEntries(context, options),
            generateStoriesEntries(context, options),
            generateCategoriesEntries(context, options),
            generateMediaEntries(context, options),
        ],
        { baseUrl: options.baseUrl },
    );
}
async function generateHomepageEntries(
    context: Pick<Context, 'locales' | 'generateUrl'>,
    {
        priority = guessPriority,
        changeFrequency = guessChangeFrequency,
    }: Pick<Options, 'priority' | 'changeFrequency'>,
) {
    const locales = await AsyncResolvable.resolve(context.locales);

    const entries = locales
        .map((localeCode) => ({
            locale: localeCode,
            url: context.generateUrl('index', { localeCode }),
            priority: priority('index', { localeCode }),
            changeFrequency: changeFrequency('index', { localeCode }),
        }))
        .filter(isNonEmptyUrl);

    return withAlternateLinks(entries);
}

async function generateStoriesEntries(
    context: Pick<Context, 'stories' | 'generateUrl'>,
    {
        priority = guessPriority,
        changeFrequency = guessChangeFrequency,
    }: Pick<Options, 'priority' | 'changeFrequency'>,
) {
    const stories = await AsyncResolvable.resolve(context.stories);

    const entries = stories
        .map((story) => {
            const params = { ...story, localeCode: story.culture.code };
            return {
                locale: story.culture.code,
                url: context.generateUrl('story', params),
                priority: priority('story', params),
                changeFrequency: changeFrequency('story', params),
            };
        })
        .filter(isNonEmptyUrl);

    return withAlternateLinks(entries);
}

async function generateCategoriesEntries(
    context: Pick<Context, 'locales' | 'categories' | 'generateUrl'>,
    {
        priority = guessPriority,
        changeFrequency = guessChangeFrequency,
    }: Pick<Options, 'priority' | 'changeFrequency'>,
) {
    const [locales, categories] = await AsyncResolvable.resolve(
        context.locales,
        context.categories,
    );

    const entries = categories
        .flatMap((category) =>
            Category.translations(category)
                .filter(({ locale }) => locales.includes(locale))
                .map((translation) => {
                    const params = { ...translation, localeCode: translation.locale };

                    return {
                        locale: translation.locale,
                        url: context.generateUrl('category', params),
                        priority: priority('category', params),
                        changeFrequency: changeFrequency('category', params),
                    };
                }),
        )
        .filter(isNonEmptyUrl);

    return withAlternateLinks(entries);
}

async function generateMediaEntries(
    context: Pick<Context, 'newsroom' | 'locales' | 'generateUrl'>,
    {
        priority = guessPriority,
        changeFrequency = guessChangeFrequency,
    }: Pick<Options, 'priority' | 'changeFrequency'>,
) {
    const [newsroom, locales] = await AsyncResolvable.resolve(context.newsroom, context.locales);

    if (newsroom.public_galleries_number === 0) return [];

    const entries = locales
        .map((localeCode) => ({
            locale: localeCode,
            url: context.generateUrl('media', { localeCode }),
            priority: priority('media', { localeCode }),
            changeFrequency: changeFrequency('media', { localeCode }),
        }))
        .filter(isNonEmptyUrl);

    return withAlternateLinks(entries);
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

export function withAlternateLinks(entries: SitemapFileEntryWithLocale[]): SitemapFileEntry[] {
    return entries.map(
        ({ locale, ...entry }): SitemapFileEntry => ({
            ...entry,
            alternate: entries
                .filter((alt) => alt.locale !== locale)
                .map((alt) => ({
                    url: alt.url,
                    lang: Locale.from(alt.locale).isoCode,
                })),
        }),
    );
}

export function isNonEmptyUrl<T extends { url?: string | undefined }>(
    value: T,
): value is T & { url: string } {
    return typeof value.url === 'string';
}
