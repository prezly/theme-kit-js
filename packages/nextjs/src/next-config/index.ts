import type { NextConfig } from 'next';

interface Options {
    /**
     * Adds security headers recommended by Prezly. Defaults to `true`
     */
    recommendedHeaders: boolean;
}

export function createNextConfig({ recommendedHeaders = true }: Partial<Options> = {}) {
    return function withPrezlyConfig(config: NextConfig): NextConfig {
        const { headers, basePath } = config;

        return {
            ...config,
            ...(recommendedHeaders && {
                headers: async () => [
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
                ],
            }),
            images: {
                ...config.images,
                domains: [...(config.images?.domains || []), 'cdn.uc.assets.prezly.com'],
            },
            ...(basePath && {
                env: {
                    ...config.env,
                    NEXT_PUBLIC_BASE_PATH: basePath,
                },
            }),
        };
    };
}
