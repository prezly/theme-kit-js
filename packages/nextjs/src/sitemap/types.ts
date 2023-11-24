import type { NewsroomGallery, StoryRef, TranslatedCategory } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';
import type { MetadataRoute } from 'next';

type Url = string;

export type Entry = undefined | string | Partial<MetadataRoute.Sitemap[number]>;
export type ChangeFrequency = MetadataRoute.Sitemap[number]['changeFrequency'];
export type Priority = MetadataRoute.Sitemap[number]['priority'];

// prettier-ignore
export type AppUrlGenerator = {
    (routeName: 'index', params: { localeCode: Locale.Code }): Url | undefined;
    (routeName: 'story', params: { localeCode: Locale.Code } & StoryRef): Url | undefined;
    (routeName: 'category', params: { localeCode: Locale.Code } & TranslatedCategory): Url | undefined;
    (routeName: 'media', params: { localeCode: Locale.Code }): | Url | undefined;
    (routeName: 'mediaAlbum', params: { localeCode: Locale.Code } & NewsroomGallery): | Url | undefined;
    (routeName: 'search', params: { localeCode: Locale.Code }): | Url | undefined;
};

// prettier-ignore
export type ChangeFrequencyFn = {
    (routeName: 'index', params: { localeCode: Locale.Code }): ChangeFrequency | undefined;
    (routeName: 'story', params: { localeCode: Locale.Code } & StoryRef): ChangeFrequency | undefined;
    (routeName: 'category', params: { localeCode: Locale.Code } & TranslatedCategory): ChangeFrequency | undefined;
    (routeName: 'media', params: { localeCode: Locale.Code }): ChangeFrequency | undefined;
}

// prettier-ignore
export type PriorityFn = {
    (routeName: 'index', params: { localeCode: Locale.Code }): Priority | undefined;
    (routeName: 'story', params: { localeCode: Locale.Code } & StoryRef): Priority | undefined;
    (routeName: 'category', params: { localeCode: Locale.Code } & TranslatedCategory): Priority | undefined;
    (routeName: 'media', params: { localeCode: Locale.Code }): Priority | undefined;
}
