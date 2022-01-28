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
import { LocaleObject } from '../intl';
import { Translations } from '../types';

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
    isTrackingEnabled?: boolean;
    localeCode: string;
    translations?: Translations;
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
    const locale = useMemo(() => LocaleObject.fromAnyCode(localeCode || 'en'), [localeCode]);

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
