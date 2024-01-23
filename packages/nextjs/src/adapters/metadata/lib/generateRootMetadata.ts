import { AsyncResolvable } from '@prezly/theme-kit-core';
import type { Metadata } from 'next';

import type { Prerequisites } from './types';
import { generatePageMetadata } from './utils';

type Params = Prerequisites & {
    indexable?: boolean;
};

export async function generateRootMetadata(
    { locale, indexable = true, ...resolvable }: Params,
    ...metadata: Metadata[]
): Promise<Metadata> {
    const [newsroom, companyInformation, languages] = await AsyncResolvable.resolve(
        resolvable.newsroom,
        resolvable.companyInformation,
        resolvable.languages,
    );

    const title =
        companyInformation.seo_settings.meta_title ||
        companyInformation.seo_settings.default_meta_title ||
        companyInformation.name;

    const description =
        companyInformation.seo_settings.meta_description ||
        companyInformation.seo_settings.default_meta_description ||
        companyInformation.about_plaintext;

    return generatePageMetadata(
        {
            locale,
            newsroom,
            companyInformation,
            languages,
            title,
            description,
        },
        {
            verification: {
                google: newsroom.google_search_console_key || undefined,
            },
            robots: {
                index: indexable && newsroom.is_indexable,
                follow: indexable && newsroom.is_indexable,
            },
        },
        ...metadata,
    );
}

export namespace generateRootMetadata {
    export type Parameters = Params;
}
