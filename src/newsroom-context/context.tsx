import type {
    Category,
    Newsroom,
    NewsroomCompanyInformation,
    NewsroomContact,
    NewsroomLanguageSettings,
    NewsroomThemePreset,
    Story,
} from '@prezly/sdk';
import React, { createContext, FunctionComponent, useMemo } from 'react';

import type { AlgoliaSettings } from '../data-fetching';
import { DEFAULT_LOCALE, LocaleObject } from '../intl';

export interface INewsroomContext {
    newsroom: Newsroom;
    companyInformation: NewsroomCompanyInformation;
    categories: Category[];
    contacts?: NewsroomContact[];
    selectedCategory?: Category;
    selectedStory?: Story;
    languages: NewsroomLanguageSettings[];
    locale: LocaleObject;
    hasError?: boolean;
    themePreset: NewsroomThemePreset;
    algoliaSettings: AlgoliaSettings;
}

interface Props extends Omit<INewsroomContext, 'locale'> {
    localeCode: string;
}

export const NewsroomContext = createContext<INewsroomContext | undefined>(undefined);

export const NewsroomContextProvider: FunctionComponent<Props> = ({
    categories,
    contacts,
    newsroom,
    selectedCategory,
    selectedStory,
    companyInformation,
    languages,
    localeCode,
    hasError,
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
                hasError,
                themePreset,
                algoliaSettings,
            }}
        >
            {children}
        </NewsroomContext.Provider>
    );
};
