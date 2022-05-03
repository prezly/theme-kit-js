import type {
    Category,
    ExtendedStory,
    Newsroom,
    NewsroomCompanyInformation,
    NewsroomContact,
    NewsroomLanguageSettings,
    NewsroomThemePreset,
    Story,
} from '@prezly/sdk';
import type { PropsWithChildren } from 'react';
import { createContext, useMemo } from 'react';

import type { AlgoliaSettings } from '../data-fetching';
import { DEFAULT_LOCALE, LocaleObject } from '../intl';

export interface NewsroomContextType {
    /**
     * Basic newsroom information: newsroom logos, settings, etc.
     */
    newsroom: Newsroom;
    /**
     * Contact information of the newsroom in the default language, usually displayed in the "About" section
     */
    companyInformation: NewsroomCompanyInformation;
    /**
     * List of all categories enabled on the newsroom
     */
    categories: Category[];
    /**
     * Optional: Contacts set up to be displayed on the newsroom home page.
     * Will only be loaded if `loadHomepageContacts` option of `getNewsroomServerSideProps` is set to `true`.
     */
    contacts?: NewsroomContact[];
    /**
     * Optional: Refers to a currently selected category when navigated to `/category/[slug]` page.
     */
    currentCategory?: Category;
    /**
     * Optional: Refers to a currently selected story when navigated to `/[slug]` page.
     */
    currentStory?: ExtendedStory;
    /**
     * List of currently enabled newsroom languages, as well as company information translated for each language
     */
    languages: NewsroomLanguageSettings[];
    /**
     * Currently chosen locale
     */
    locale: LocaleObject;
    /**
     * Theme settings as set in the Prezly app.
     * You need to provide `PREZLY_THEME_UUID` in environment variables in order for the preset to be loaded.
     * Only applicable to themes hosted on the Prezly infrastructure.
     */
    themePreset: NewsroomThemePreset | null;
    /**
     * Environment variables required for Algolia search to work.
     */
    algoliaSettings: AlgoliaSettings;
}

export interface NewsroomContextProps extends Omit<NewsroomContextType, 'locale'> {
    localeCode: string;
}

export const NewsroomContext = createContext<NewsroomContextType | undefined>(undefined);

/**
 * This context provides common Newsroom information retrieved by `getNewsroomServerSideProps` helper.
 * Please refer to the `NewsroomContextType` definition for more info on what's exposed from the context.
 */
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
