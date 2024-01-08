import { Category } from '@prezly/sdk';
import { AsyncResolvable, Resolvable } from '@prezly/theme-kit-core';
import type { Metadata } from 'next';

import type { AbsoluteUrlGenerator, Prerequisites } from './types';
import { generatePageMetadata } from './utils';

export type Params = Prerequisites & {
    category: AsyncResolvable<Category>;
    generateUrl: AsyncResolvable<AbsoluteUrlGenerator>;
};

export async function generateCategoryPageMetadata(
    { generateUrl: resolvableUrlGenerator, category: resolvableCategory, ...prerequisites }: Params,
    ...metadata: Metadata[]
): Promise<Metadata> {
    const generateUrl = await AsyncResolvable.resolve(resolvableUrlGenerator);
    const category = await AsyncResolvable.resolve(resolvableCategory);

    const { name, description } =
        Category.translation(category, Resolvable.resolve(prerequisites.locale)) ?? {};

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
