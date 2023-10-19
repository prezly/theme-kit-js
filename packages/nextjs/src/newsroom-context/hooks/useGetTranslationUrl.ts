import type { Category, ExtendedStory } from '@prezly/sdk';
import {
    getCategoryHasTranslation,
    getCategoryUrl,
    isStoryPublished,
    Visibility,
} from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { useCurrentCategory } from './useCurrentCategory';
import { useCurrentStory } from './useCurrentStory';

function getAllowedTranslationVisibilityValues(
    story: Pick<ExtendedStory, 'visibility'>,
): Visibility[] {
    const { visibility } = story;

    switch (visibility) {
        case Visibility.EMBARGO:
            return [Visibility.EMBARGO, Visibility.PUBLIC];
        case Visibility.PRIVATE:
            return [Visibility.PRIVATE, Visibility.PUBLIC];
        case Visibility.CONFIDENTIAL:
            return [Visibility.CONFIDENTIAL, Visibility.PRIVATE, Visibility.PUBLIC];
        default:
            return [Visibility.PUBLIC];
    }
}

/**
 * Determine correct URL for translated stories/categories with a fallback to homepage.
 * E.g. if a story has a translation, the function will return the localized slug URL.
 * If there is no translation for the story, it will return the index page URL (`/`),
 * or empty string, if `noFallback` is set to `true` (this is useful for alternate locale links).
 */
function getTranslationUrl(
    locale: Locale,
    path: string,
    currentCategory?: Pick<Category, 'i18n' | 'display_name'>,
    currentStory?: ExtendedStory,
    noFallback?: boolean,
) {
    if (currentCategory) {
        if (getCategoryHasTranslation(currentCategory, locale)) {
            return getCategoryUrl(currentCategory, locale);
        }

        if (noFallback) {
            return '';
        }

        return '/';
    }

    if (currentStory && currentStory.culture.locale !== locale.code) {
        const allowedVisibilityValues = getAllowedTranslationVisibilityValues(currentStory);

        const translatedStory = currentStory.translations.find(
            ({ culture, status, visibility }) =>
                culture.locale === locale.code &&
                isStoryPublished(status) &&
                allowedVisibilityValues.includes(visibility),
        );
        if (translatedStory) {
            return `/${translatedStory.slug}`;
        }

        if (noFallback) {
            return '';
        }

        return '/';
    }

    return path;
}

/**
 * This hook returns a function that is meant to be used in language pickers and alternate locales list for the pages.
 * `noFallback` parameter is useful for alternate language links in the `head` section of the document (so that there are no unwanted links to the homepage).
 */
export function useGetTranslationUrl() {
    const { asPath } = useRouter();
    const currentCategory = useCurrentCategory();
    const currentStory = useCurrentStory();

    return useCallback(
        (locale: Locale, noFallback?: boolean) =>
            getTranslationUrl(locale, asPath, currentCategory, currentStory, noFallback),
        [asPath, currentCategory, currentStory],
    );
}
