import type {
    Category,
    ExtendedStory,
    Newsroom,
    NewsroomCompanyInformation,
    NewsroomContact,
    NewsroomLanguageSettings,
    NewsroomThemePreset,
} from '@prezly/sdk';
import { createContext, FunctionComponent, useMemo } from 'react';

import type { AlgoliaSettings } from '../data-fetching';
import { DEFAULT_LOCALE, LocaleObject } from '../intl';

export interface NewsroomContextType {
    newsroom: Newsroom;
    companyInformation: NewsroomCompanyInformation;
    categories: Category[];
    contacts?: NewsroomContact[];
    selectedCategory?: Category;
    selectedStory?: ExtendedStory;
    languages: NewsroomLanguageSettings[];
    locale: LocaleObject;
    themePreset: NewsroomThemePreset;
    algoliaSettings: AlgoliaSettings;
}

interface Props extends Omit<NewsroomContextType, 'locale'> {
    localeCode: string;
}

export const NewsroomContext = createContext<NewsroomContextType | undefined>(undefined);

export const NewsroomContextProvider: FunctionComponent<Props> = ({
    categories,
    contacts,
    newsroom,
    selectedCategory,
    selectedStory,
    companyInformation,
    languages,
    localeCode,
    themePreset,
    algoliaSettings,
    children,
}) => {
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
                selectedCategory,
                selectedStory,
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
};
