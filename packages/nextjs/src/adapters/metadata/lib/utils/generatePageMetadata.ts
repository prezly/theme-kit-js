/* eslint-disable @typescript-eslint/no-use-before-define */
import { AsyncResolvable, Newsrooms } from '@prezly/theme-kit-core';
import { Locale } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

import type { Prerequisites } from '../types';

import type { UrlGenerator } from './generateAlternateLanguageLinks';
import { generateAlternateLanguageLinks } from './generateAlternateLanguageLinks';
import { mergePageMetadata } from './mergePageMetadata';

type Params = Prerequisites & {
    title?: Metadata['title'];
    description?: Metadata['description'];
    imageUrl?: string;
    generateUrl?: UrlGenerator;
};

export async function generatePageMetadata(
    { title, description, imageUrl, generateUrl, ...resolvable }: Params,
    ...metadata: Metadata[]
): Promise<Metadata> {
    const [locale, newsroom, companyInformation, languages] = await AsyncResolvable.resolve(
        resolvable.locale,
        resolvable.newsroom,
        resolvable.companyInformation,
        resolvable.languages,
    );

    const siteName = companyInformation.name || newsroom.display_name;
    const titleString = extractPlaintextTitle(title);
    const ogImageUrl = imageUrl ?? Newsrooms.getOgImageUrl(newsroom, Locale.from(locale));

    return mergePageMetadata(
        {
            title,
            description,
            alternates: {
                canonical: generateUrl?.(locale),
                types: {
                    [`application/rss+xml`]: '/feed', // TODO: Check if it's fine using a relative URL
                },
                languages: generateUrl
                    ? generateAlternateLanguageLinks(languages, generateUrl)
                    : undefined,
            },
            openGraph: {
                siteName,
                title: titleString,
                description: description ?? undefined,
                locale,
                images: [{ url: ogImageUrl, alt: titleString }],
            },
            twitter: {
                site: siteName,
                card: 'summary',
                images: [ogImageUrl],
            },
        },
        ...metadata,
    );
}

export namespace generatePageMetadata {
    export type Parameters = Params;
}

function extractPlaintextTitle(title: Metadata['title']): string | undefined {
    if (title === undefined || title === null) {
        return undefined;
    }

    if (typeof title === 'string') {
        return title;
    }

    if ('absolute' in title && title.absolute) {
        return title.absolute;
    }

    if ('default' in title && title.default) {
        return title.default;
    }

    return undefined;
}
