import type {
    Category,
    Culture,
    ExtendedStory,
    Newsroom,
    NewsroomCompanyInformation,
    NewsroomContact,
    NewsroomGallery,
    NewsroomLanguageSettings,
    NewsroomThemePreset,
    Notification,
} from '@prezly/sdk';
import { DEFAULT_LOCALE, LocaleObject } from '@prezly/theme-kit-core';
import type { SearchSettings } from '@prezly/theme-kit-core/server';
import type { PropsWithChildren } from 'react';
import { createContext, useMemo } from 'react';

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
     * Optional: Refers to a currently selected media gallery when navigated to `/media/album/[uuid]` page.
     */
    currentGallery?: NewsroomGallery;
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
     * Newsroom user-facing notifications (usually displayed as top-edge banners)
     */
    notifications: Notification[];
    /**
     * Theme settings as set in the Prezly app.
     * You need to provide `PREZLY_THEME_UUID` in environment variables in order for the preset to be loaded.
     * Only applicable to themes hosted on the Prezly infrastructure.
     */
    themePreset: NewsroomThemePreset | null;
    /**
     * Config for Algolia/MeiliSearch
     */
    searchSettings?: SearchSettings;
}

export interface NewsroomContextProps extends Omit<NewsroomContextType, 'locale'> {
    localeCode: Culture.Code;
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
    currentGallery,
    currentStory,
    companyInformation,
    languages,
    localeCode,
    notifications,
    themePreset,
    searchSettings,
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
                currentGallery,
                currentStory,
                companyInformation,
                languages,
                locale,
                notifications,
                themePreset,
                searchSettings,
            }}
        >
            {children}
        </NewsroomContext.Provider>
    );
}
