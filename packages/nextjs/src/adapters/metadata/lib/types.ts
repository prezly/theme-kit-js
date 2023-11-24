import type {
    Newsroom,
    NewsroomCompanyInformation,
    NewsroomGallery,
    NewsroomLanguageSettings,
    StoryRef,
    TranslatedCategory,
} from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';

import type { AsyncResolvable, Resolvable } from '../../../utils';

export type Url = `/${string}`;

// prettier-ignore
export type AppUrlGenerator = {
    (routeName: 'index', params: { localeCode: Locale.Code }): Url | undefined;
    (routeName: 'story', params: { localeCode: Locale.Code } & StoryRef): Url | undefined;
    (routeName: 'category', params: { localeCode: Locale.Code } & TranslatedCategory): Url | undefined;
    (routeName: 'mediaAlbum', params: { localeCode: Locale.Code } & NewsroomGallery): | Url | undefined;
};

export type Prerequisites = {
    locale: Resolvable<Locale.Code>;
    newsroom: AsyncResolvable<Newsroom>;
    companyInformation: AsyncResolvable<NewsroomCompanyInformation>;
    languages: AsyncResolvable<NewsroomLanguageSettings[]>;
};
