import { Category } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';
import type { Metadata } from 'next';

import { type AsyncResolvable, resolve, resolveAsync } from '../../../utils';

import type { Prerequisites, Url } from './types';
import { generatePageMetadata } from './utils';

export type Params = Prerequisites & {
    category: AsyncResolvable<Category>;
    generateUrl?: (locale: Locale.Code, category: Category) => Url | undefined;
};

export async function generateCategoryPageMetadata(
    { generateUrl, category: resolvableCategory, ...prerequisites }: Params,
    ...metadata: Metadata[]
): Promise<Metadata> {
    const category = await resolveAsync(resolvableCategory);
    const { name, description } =
        Category.translation(category, resolve(prerequisites.locale)) ?? {};

    return generatePageMetadata(
        {
            ...prerequisites,
            title: name,
            description,
            generateUrl: (localeCode) => generateUrl?.(localeCode, category),
        },
        ...metadata,
    );
}

export namespace generateCategoryPageMetadata {
    export type Parameters = Params;
}
