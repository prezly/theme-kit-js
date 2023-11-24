import type { NewsroomLanguageSettings } from '@prezly/sdk';
import { Metadata as MetadataHelper } from '@prezly/theme-kit-core';
import type { Locale } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

type Alternates = NonNullable<Metadata['alternates']>;
export type UrlGenerator = (localeCode: Locale.Code) => string | undefined;

export function generateAlternateLanguageLinks(
    languages: Pick<NewsroomLanguageSettings, 'code' | 'is_default'>[],
    generateUrl: UrlGenerator,
): Alternates['languages'] {
    const links = MetadataHelper.getAlternateLanguageLinks(languages, generateUrl);

    return Object.fromEntries(links.map((link) => [link.hrefLang, link.href]));
}
