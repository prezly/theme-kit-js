import type { Category, ExtendedStory } from '@prezly/sdk';
import { Story } from '@prezly/sdk';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import type { LocaleObject } from '../../intl';
import { getCategoryHasTranslation, getCategoryUrl } from '../../utils';

import { useCurrentCategory } from './useCurrentCategory';
import { useCurrentStory } from './useCurrentStory';

function getAllowedTranslationVisibilityValues(story: ExtendedStory): Story.Visibility[] {
    const { visibility } = story;

    switch (visibility) {
        case Story.Visibility.EMBARGO:
            return [Story.Visibility.EMBARGO, Story.Visibility.PUBLIC];
        case Story.Visibility.PRIVATE:
            return [Story.Visibility.PRIVATE, Story.Visibility.PUBLIC];
        case Story.Visibility.CONFIDENTIAL:
            return [
                Story.Visibility.CONFIDENTIAL,
                Story.Visibility.PRIVATE,
                Story.Visibility.PUBLIC,
            ];
        default:
            return [Story.Visibility.PUBLIC];
    }
}

/**
 * Determine correct URL for translated stories/categories with a fallback to homepage.
 * E.g. if a story has a translation, the function will return the localized slug URL.
 * If there is no translation for the story, it will return the index page URL (`/`),
 * or empty string, if `noFallback` is set to `true` (this is useful for alternate locale links).
 */
function getTranslationUrl(
    locale: LocaleObject,
    path: string,
    currentCategory?: Category,
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

    const localeCode = locale.toUnderscoreCode();

    if (currentStory && currentStory.culture.locale !== localeCode) {
        const allowedVisibilityValues = getAllowedTranslationVisibilityValues(currentStory);

        const translatedStory = currentStory.translations.find(
            ({ culture, visibility }) =>
                culture.locale === localeCode && allowedVisibilityValues.includes(visibility),
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
        (locale: LocaleObject, noFallback?: boolean) =>
            getTranslationUrl(locale, asPath, currentCategory, currentStory, noFallback),
        [asPath, currentCategory, currentStory],
    );
}
