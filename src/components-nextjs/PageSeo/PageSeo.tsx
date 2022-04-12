import { NextSeo } from 'next-seo';
import type { NextSeoProps } from 'next-seo';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { stripHtml } from 'string-strip-html';

import { getNewsroomLogoUrl, getUsedLanguages } from '../../data-fetching';
import { LocaleObject } from '../../intl';
import {
    useCompanyInformation,
    useCurrentLocale,
    useCurrentStory,
    useGetLinkLocaleSlug,
    useGetTranslationUrl,
    useLanguages,
    useNewsroom,
} from '../../newsroom-context';

import { getAbsoluteUrl } from './lib/getAbsoluteUrl';
import type { AlternateLanguageLink } from './lib/types';

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
    const newsroom = useNewsroom();
    const currentLocale = useCurrentLocale();
    const languages = useLanguages();
    const getTranslationUrl = useGetTranslationUrl();
    const getLinkLocaleSlug = useGetLinkLocaleSlug();
    const currentStory = useCurrentStory();
    const { asPath } = useRouter();

    const pageTitle = title || companyInformation.name;
    const pageDescription = description || stripHtml(companyInformation.about).result;
    const canonicalUrl =
        canonical || getAbsoluteUrl(asPath, newsroom.url, getLinkLocaleSlug(currentLocale));
    const siteName = companyInformation.name;
    const logoUrl = imageUrl || getNewsroomLogoUrl(newsroom);

    const alternateLanguageLinks: AlternateLanguageLink[] = useMemo(() => {
        if (!languages.length) {
            return [];
        }

        const alternateLanguages = getUsedLanguages(languages).filter(
            (language) => language.code !== currentLocale.toUnderscoreCode(),
        );

        return alternateLanguages
            .map((language) => {
                const locale = LocaleObject.fromAnyCode(language.code);

                const translationLink = getTranslationUrl(locale, true);

                if (!translationLink) {
                    return undefined;
                }

                return {
                    hrefLang: locale.toHyphenCode(),
                    href: getAbsoluteUrl(
                        translationLink,
                        newsroom.url,
                        currentStory && translationLink !== '/' ? false : getLinkLocaleSlug(locale),
                    ),
                };
            })
            .filter<AlternateLanguageLink>(Boolean as any);
    }, [
        currentLocale,
        getLinkLocaleSlug,
        getTranslationUrl,
        languages,
        newsroom.url,
        currentStory,
    ]);

    return (
        <NextSeo
            title={pageTitle}
            description={pageDescription}
            canonical={canonicalUrl}
            openGraph={{
                url: canonicalUrl,
                title: pageTitle,
                description: pageDescription,
                locale: currentLocale.toUnderscoreCode(),
                images: [
                    {
                        url: logoUrl,
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
            additionalMetaTags={[{ name: 'twitter:image', content: logoUrl }]}
            languageAlternates={alternateLanguageLinks}
            {...nextSeoProps}
        />
    );
}
