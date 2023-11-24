import { Category } from '@prezly/sdk';
import type { Metadata } from 'next';

import { type AsyncResolvable, resolve, resolveAsync } from '../../../utils';

import type { AppUrlGenerator, Prerequisites } from './types';
import { generatePageMetadata } from './utils';

export type Params = Prerequisites & {
    category: AsyncResolvable<Category>;
    generateUrl: AppUrlGenerator;
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
            generateUrl: (localeCode) => {
                const translated = Category.translation(category, localeCode);
                return translated && generateUrl('category', { ...translated, localeCode });
            },
        },
        ...metadata,
    );
}

export namespace generateCategoryPageMetadata {
    export type Parameters = Params;
}
