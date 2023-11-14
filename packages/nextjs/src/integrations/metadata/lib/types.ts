import type { Newsroom, NewsroomCompanyInformation, NewsroomLanguageSettings } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';

import type { AsyncResolvable, Resolvable } from '../../../utils';

export type Url = `/${string}`;

export type PageUrlGenerator = (locale: Locale.Code) => Url | undefined;

export type Prerequisites = {
    locale: Resolvable<Locale.Code>;
    newsroom: AsyncResolvable<Newsroom>;
    companyInformation: AsyncResolvable<NewsroomCompanyInformation>;
    languages: AsyncResolvable<NewsroomLanguageSettings[]>;
};
