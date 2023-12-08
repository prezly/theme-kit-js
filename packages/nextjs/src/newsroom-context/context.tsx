import type {
    Category,
    ExtendedStory,
    Newsroom,
    NewsroomCompanyInformation,
    NewsroomContact,
    NewsroomLanguageSettings,
    NewsroomThemePreset,
    Notification,
    TranslatedCategory,
} from '@prezly/sdk';
import type { Algolia } from '@prezly/theme-kit-core/server';
import type { Locale } from '@prezly/theme-kit-intl';
import type { PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';

export interface NewsroomContext {
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
    currentCategory?: TranslatedCategory;
    /**
     * Optional: Refers to a currently selected story when navigated to `/[slug]` page.
     */
    currentStory?: ExtendedStory;
    /**
     * List of currently enabled newsroom languages, as well as company information translated for each language
     */
    languages: NewsroomLanguageSettings[];
    /**
     * Current locale
     */
    locale: Locale.Code;
    /**
     * Default newsroom locale.
     */
    defaultLocale: Locale.Code;
    /**
     * List of all enabled locales for the newsroom.
     */
    locales: Locale.Code[];
    /**
     * List of all enabled newsroom locales that have published public stories visible.
     */
    usedLocales: Locale.Code[];
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
     * Environment variables required for Algolia search to work.
     */
    algoliaSettings: Algolia.Settings;
}

const context = createContext<NewsroomContext | undefined>(undefined);

/**
 * This context provides common Newsroom information retrieved by `getNewsroomServerSideProps` helper.
 * Please refer to the `NewsroomContext` definition for more info on what's exposed from the context.
 */
export function NewsroomContextProvider({
    categories,
    contacts,
    newsroom,
    currentCategory,
    currentStory,
    companyInformation,
    languages,
    locale,
    defaultLocale,
    locales,
    usedLocales,
    notifications,
    themePreset,
    algoliaSettings,
    children,
}: PropsWithChildren<NewsroomContext>) {
    return (
        <context.Provider
            value={{
                categories,
                contacts,
                newsroom,
                currentCategory,
                currentStory,
                companyInformation,
                languages,
                locale,
                defaultLocale,
                locales,
                usedLocales,
                notifications,
                themePreset,
                algoliaSettings,
            }}
        >
            {children}
        </context.Provider>
    );
}

export function useNewsroomContext() {
    // TS Compiler is having a hard time figuring this type implicitly, so we have to set it explicitly
    // See https://github.com/microsoft/TypeScript/issues/5711#issuecomment-340283439
    const newsroomContext: NewsroomContext | undefined = useContext(context);
    if (!newsroomContext) {
        throw new Error('No `NewsroomContextProvider` found when calling `useNewsroomContext`');
    }

    return newsroomContext;
}
