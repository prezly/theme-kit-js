// @ts-expect-error
// eslint-disable-next-line import/no-unresolved
const locales = require('@prezly/theme-kit-core/localeConfig');

// eslint-disable-next-line import/no-unresolved
const { DUMMY_DEFAULT_LOCALE } = require('./intl/locale.js');

/** @type {import('next').NextConfig['i18n']} */
const i18nConfig = {
    // These are all the locales you want to support in
    // your application
    locales: [...locales, DUMMY_DEFAULT_LOCALE],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    // We use Pseudo locale used for localization testing, to reliably determine if we need to fallback to the default newsroom language
    defaultLocale: DUMMY_DEFAULT_LOCALE,
    // Default locale detection is disabled, since the locales would be determined by Prezly API
    localeDetection: false,
};

module.exports = i18nConfig;
