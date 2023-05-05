import {
    getAlternateLanguageLinks,
    getNewsroomOgImageUrl,
    getUsedLanguages,
} from '@prezly/theme-kit-core';
import type { AlternateLanguageLink } from '@prezly/theme-kit-core';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import type { NextSeoProps } from 'next-seo';
import { useMemo } from 'react';

import {
    useCompanyInformation,
    useCurrentLocale,
    useCurrentStory,
    useGetLinkLocaleSlug,
    useGetTranslationUrl,
    useLanguages,
    useNewsroom,
} from '../../newsroom-context';

import { getAbsoluteUrl } from './lib';

type Props = NextSeoProps & {
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
    const languages = useLanguages();
    const getTranslationUrl = useGetTranslationUrl();
    const getLinkLocaleSlug = useGetLinkLocaleSlug();
    const currentStory = useCurrentStory();
    const { asPath } = useRouter();

    const pageTitle =
        companyInformation.seo_settings.meta_title ||
        companyInformation.seo_settings.default_meta_title ||
        title ||
        companyInformation.name;
    const pageDescription =
        companyInformation.seo_settings.meta_description ||
        companyInformation.seo_settings.default_meta_description ||
        description ||
        companyInformation.about_plaintext;
    const canonicalUrl =
        canonical || getAbsoluteUrl(asPath, site.url, getLinkLocaleSlug(currentLocale));
    const siteName = companyInformation.name;
    const sharingImageUrl = imageUrl || getNewsroomOgImageUrl(site, currentLocale);

    const alternateLanguageLinks: AlternateLanguageLink[] = useMemo(() => {
        if (!languages.length) {
            return [];
        }

        const usedLanguages = getUsedLanguages(languages);

        return getAlternateLanguageLinks(usedLanguages, (locale) => {
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
    }, [currentStory, getLinkLocaleSlug, getTranslationUrl, languages, site.url]);

    return (
        <NextSeo
            title={pageTitle}
            description={pageDescription}
            canonical={canonicalUrl}
            noindex={nextSeoProps.noindex ?? !site.is_indexable}
            nofollow={nextSeoProps.nofollow ?? !site.is_indexable}
            openGraph={{
                url: canonicalUrl,
                title: pageTitle,
                description: pageDescription,
                locale: currentLocale.toUnderscoreCode(),
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
                    href: getAbsoluteUrl('/feed', site.url),
                },
            ]}
            languageAlternates={alternateLanguageLinks}
            {...nextSeoProps}
        />
    );
}
