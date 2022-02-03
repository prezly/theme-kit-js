import type { Category, ExtendedStory } from '@prezly/sdk';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { getCategoryHasTranslation, getCategoryUrl } from '../../data-fetching';
import type { LocaleObject } from '../../intl';

import { useCurrentCategory } from './useCurrentCategory';
import { useCurrentStory } from './useCurrentStory';

// Determine correct URL for translated stories/categories with a fallback to homepage
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
        const translatedStory = currentStory.translations.find(
            ({ culture }) => culture.locale === localeCode,
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
