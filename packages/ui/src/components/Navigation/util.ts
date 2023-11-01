import type { Category, ExtendedStory } from '@prezly/sdk';
import {
    getCategoryHasTranslation,
    getCategoryUrl,
    isStoryPublished,
    type LocaleObject,
    Visibility,
} from '@prezly/theme-kit-core';

export function extractDomainFromUrl(url: string): string {
    let result = '';
    let match: RegExpMatchArray | null = null;

    match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\\/\n\\?\\=]+)/im);

    if (match) {
        [, result] = match;

        match = result.match(/^[^\\.]+\.(.+\..+)$/);

        if (match) {
            [, result] = match;
        }
    }

    return result ?? url;
}

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

export function getTranslationUrl(
    locale: LocaleObject,
    currentCategory?: Pick<Category, 'i18n' | 'display_name'>,
    currentStory?: ExtendedStory,
    noFallback?: boolean,
) {
    const path = window.location.pathname + window.location.search;

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
            ({ culture, status, visibility }) =>
                culture.locale === localeCode &&
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
