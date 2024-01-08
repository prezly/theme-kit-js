import type {
    Newsroom,
    NewsroomCompanyInformation,
    NewsroomGallery,
    NewsroomLanguageSettings,
    StoryRef,
    TranslatedCategory,
} from '@prezly/sdk';
import type { AsyncResolvable } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';

export type Url = `http://${string}` | `https://${string}`;

// prettier-ignore
export type AbsoluteUrlGenerator = {
    (routeName: 'index', params: { localeCode: Locale.Code }): Url | undefined;
    (routeName: 'story', params: { localeCode: Locale.Code } & StoryRef): Url | undefined;
    (routeName: 'category', params: { localeCode: Locale.Code } & TranslatedCategory): Url | undefined;
    (routeName: 'media', params: { localeCode: Locale.Code }): Url | undefined;
    (routeName: 'mediaGallery', params: { localeCode: Locale.Code } & NewsroomGallery): Url | undefined;
    (routeName: 'search', params: { localeCode: Locale.Code }): Url | undefined;
};

export type Prerequisites = {
    locale: Locale.Code;
    newsroom: AsyncResolvable<Newsroom>;
    companyInformation: AsyncResolvable<NewsroomCompanyInformation>;
    languages: AsyncResolvable<NewsroomLanguageSettings[]>;
};
