import type { Metadata } from 'next';

import { resolveAsync } from '#utils';

import type { PageUrlGenerator, Prerequisites } from './types';
import { generatePageMetadata } from './utils';

type Params = Prerequisites & {
    indexable?: boolean;
    generateUrl?: PageUrlGenerator;
};

export async function generateRootMetadata(
    { indexable = true, generateUrl, ...resolvable }: Params,
    ...metadata: Metadata[]
): Promise<Metadata> {
    const [locale, newsroom, companyInformation, languages] = await resolveAsync(
        resolvable.locale,
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
            generateUrl,
            title: {
                template: `%s | ${title}`,
                default: title,
            },
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
