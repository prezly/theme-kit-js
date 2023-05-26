import locales from '@prezly/theme-kit-core/localeConfig';
import type { NextConfig } from 'next';

import { DUMMY_DEFAULT_LOCALE } from './intl';

interface PrezlyConfigParams {
    /**
     * Enables Prezly i18n support. Defaults to `true`
     */
    i18n: boolean;
    /**
     * Enables support for Prezly images in `next/image`. Defaults to `true`
     */
    images: boolean;
    /**
     * Adds security headers recommended by Prezly. Defaults to `true`
     */
    recommendedHeaders: boolean;
}

const DEFAULT_PARAMS: PrezlyConfigParams = {
    i18n: true,
    images: true,
    recommendedHeaders: true,
};

export = function PrezlyConfig(params?: Partial<PrezlyConfigParams>) {
    const finalParams = { ...DEFAULT_PARAMS, ...params };

    return function withPrezlyConfig(config: NextConfig): NextConfig {
        const { headers } = config;

        return {
            ...config,
            ...(finalParams.recommendedHeaders && {
                async headers() {
                    return [
                        ...(typeof headers === 'function' ? await headers() : []),
                        {
                            source: '/(.*)',
                            locale: false,
                            headers: [
                                {
                                    key: 'Strict-Transport-Security',
                                    value: 'max-age=63072000; includeSubDomains; preload',
                                },
                                {
                                    key: 'X-XSS-Protection',
                                    value: '1; mode=block',
                                },
                                {
                                    key: 'X-Frame-Options',
                                    value: 'SAMEORIGIN',
                                },
                                {
                                    key: 'X-Content-Type-Options',
                                    value: 'nosniff',
                                },
                                {
                                    key: 'Content-Security-Policy',
                                    value: 'upgrade-insecure-requests; report-uri https://csp.prezly.net/report;',
                                },
                            ],
                        },
                    ];
                },
            }),
            images: {
                ...config.images,
                domains: [...(config.images?.domains || []), 'cdn.uc.assets.prezly.com'],
            },
            ...(finalParams.i18n && {
                i18n: {
                    ...config.i18n,
                    // These are all the locales you want to support in
                    // your application
                    locales: [...locales, DUMMY_DEFAULT_LOCALE],
                    // This is the default locale you want to be used when visiting
                    // a non-locale prefixed path e.g. `/hello`
                    // We use Pseudo locale used for localization testing, to reliably determine if we need to fallback to the default newsroom language
                    defaultLocale: DUMMY_DEFAULT_LOCALE,
                    // Default locale detection is disabled, since the locales would be determined by Prezly API
                    localeDetection: false,
                },
            }),
        };
    };
};
