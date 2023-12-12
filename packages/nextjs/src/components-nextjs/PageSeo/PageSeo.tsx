import { Metadata, Newsrooms } from '@prezly/theme-kit-core';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import type { NextSeoProps } from 'next-seo';
import { useMemo } from 'react';

import {
    useCompanyInformation,
    useCurrentLocale,
    useCurrentStory,
    useDefaultLocale,
    useGetLinkLocaleSlug,
    useGetTranslationUrl,
    useNewsroom,
    useUsedLocales,
} from '../../newsroom-context';

import { getAbsoluteUrl } from './lib';

type Props = Omit<NextSeoProps, 'title'> & {
    /**
     * Overrides the title that is used in the `<title>` tag and in the `og:title` meta tag. Defaults to the Site SEO title or Site name.
     * If a function is provided, it will be called with the Site SEO title as the first argument.
     */
    title?: string | ((metaTitle: string) => string);
    imageUrl?: string;
};

/**
 * This component provides base page attributes for every Newsroom page.
 * It depends on information from NewsroomContext, so the component should be placed inside the `NewsroomContextProvider`.
 * You can pass additional props expected by NextSeo component to override any info that is provided by the NewsroomContext.
 */
export function PageSeo({
    title,
    description,
    imageUrl,
    canonical,
    openGraph,
    twitter,
    ...nextSeoProps
}: Props) {
    const companyInformation = useCompanyInformation();
    const site = useNewsroom();
    const currentLocale = useCurrentLocale();
    const usedLocales = useUsedLocales();
    const defaultLocale = useDefaultLocale();
    const getTranslationUrl = useGetTranslationUrl();
    const getLinkLocaleSlug = useGetLinkLocaleSlug();
    const currentStory = useCurrentStory();
    const { asPath, basePath } = useRouter();
    const currentPath = `${basePath}${asPath}`;

    const pageTitle = useMemo(() => {
        const defaultMetaTitle =
            companyInformation.seo_settings.meta_title ||
            companyInformation.seo_settings.default_meta_title ||
            companyInformation.name;

        if (title && typeof title === 'function') {
            return title(defaultMetaTitle);
        }

        return title || defaultMetaTitle;
    }, [title, companyInformation]);

    const pageDescription =
        description ||
        companyInformation.seo_settings.meta_description ||
        companyInformation.seo_settings.default_meta_description ||
        companyInformation.about_plaintext;

    const canonicalUrl =
        canonical || getAbsoluteUrl(currentPath, site.url, getLinkLocaleSlug(currentLocale));
    const siteName = companyInformation.name;
    const sharingImageUrl = imageUrl || Newsrooms.getOgImageUrl(site, currentLocale);

    const alternateLanguageLinks: Metadata.AlternateLanguageLink[] = useMemo(() => {
        if (!usedLocales.length) {
            return [];
        }

        const usedLanguages = usedLocales.map((code) => ({
            code,
            is_default: code === defaultLocale,
        }));

        return Metadata.getAlternateLanguageLinks(usedLanguages, (locale) => {
            const translationUrl = getTranslationUrl(locale);

            if (!translationUrl) {
                return undefined;
            }

            return getAbsoluteUrl(
                translationUrl,
                site.url,
                currentStory && translationUrl !== '/' ? false : getLinkLocaleSlug(locale),
            );
        });
    }, [currentStory, getLinkLocaleSlug, getTranslationUrl, usedLocales, defaultLocale, site.url]);

    return (
        <NextSeo
            title={pageTitle}
            description={pageDescription}
            canonical={canonicalUrl}
            noindex={nextSeoProps.noindex || !site.is_indexable}
            nofollow={nextSeoProps.nofollow || !site.is_indexable}
            openGraph={{
                url: canonicalUrl,
                title: pageTitle,
                description: pageDescription,
                locale: currentLocale,
                images: [
                    {
                        url: sharingImageUrl,
                        alt: pageTitle,
                    },
                ],
                site_name: siteName,
                ...openGraph,
            }}
            twitter={{
                site: siteName,
                cardType: 'summary',
                ...twitter,
            }}
            additionalMetaTags={[
                { name: 'twitter:image', content: sharingImageUrl },
                site.google_search_console_key && {
                    name: 'google-site-verification',
                    content: site.google_search_console_key,
                },
            ].filter((tag): tag is Exclude<typeof tag, string | null> => Boolean(tag))}
            additionalLinkTags={[
                {
                    rel: 'alternate',
                    type: 'application/rss+xml',
                    href: getAbsoluteUrl(`${basePath}/feed`, site.url),
                },
            ]}
            languageAlternates={alternateLanguageLinks}
            {...nextSeoProps}
        />
    );
}
