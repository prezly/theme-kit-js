import type {
    Category,
    ExtendedStory,
    Newsroom,
    NewsroomCompanyInformation,
    NewsroomContact,
    NewsroomLanguageSettings,
    NewsroomThemePreset,
} from '@prezly/sdk';
import type { PropsWithChildren } from 'react';
import { createContext, useMemo } from 'react';

import type { AlgoliaSettings } from '../data-fetching';
import { DEFAULT_LOCALE, LocaleObject } from '../intl';

export interface NewsroomContextType {
    newsroom: Newsroom;
    companyInformation: NewsroomCompanyInformation;
    categories: Category[];
    contacts?: NewsroomContact[];
    currentCategory?: Category;
    currentStory?: ExtendedStory;
    languages: NewsroomLanguageSettings[];
    locale: LocaleObject;
    themePreset: NewsroomThemePreset;
    algoliaSettings: AlgoliaSettings;
}

export interface NewsroomContextProps extends Omit<NewsroomContextType, 'locale'> {
    localeCode: string;
}

export const NewsroomContext = createContext<NewsroomContextType | undefined>(undefined);

export function NewsroomContextProvider({
    categories,
    contacts,
    newsroom,
    currentCategory,
    currentStory,
    companyInformation,
    languages,
    localeCode,
    themePreset,
    algoliaSettings,
    children,
}: PropsWithChildren<NewsroomContextProps>) {
    const locale = useMemo(
        () => LocaleObject.fromAnyCode(localeCode || DEFAULT_LOCALE),
        [localeCode],
    );

    return (
        <NewsroomContext.Provider
            value={{
                categories,
                contacts,
                newsroom,
                currentCategory,
                currentStory,
                companyInformation,
                languages,
                locale,
                themePreset,
                algoliaSettings,
            }}
        >
            {children}
        </NewsroomContext.Provider>
    );
}
