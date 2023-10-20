export { getFallbackLocale } from './getFallbackLocale';
export { getLanguageDisplayName } from './getLanguageDisplayName';
export {
    getCompanyInformation,
    getDefaultLanguage,
    getLanguageByExactLocaleCode,
    getLanguageByNeutralLocaleCode,
    getLanguageByShortRegionCode,
    getLanguageFromStory,
    getNotifications,
    getUnusedLanguages,
    getUsedLanguages,
    isNumberCode,
} from './languages';
export { default as localeConfig } from './localeConfig';
export { DEFAULT_LOCALE, getSupportedLocaleIsoCode } from './locale';

// shortest locale slug generation and matching
export { getShortestLocaleSlug } from './getShortestLocaleSlug';
export { matchLanguageByLocaleSlug } from './matchLanguageByLocaleSlug';
