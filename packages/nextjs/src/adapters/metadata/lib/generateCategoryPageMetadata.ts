import { Category } from '@prezly/sdk';
import { AsyncResolvable, ContentDelivery, Resolvable } from '@prezly/theme-kit-core';
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
                if (!translated || translated.public_stories_number === 0) return undefined;

                // `path` for routes with nested category URLs (`/category/*path`),
                // `slug` for routes with one segment (`/category/:slug`).
                return generateUrl('category', {
                    ...translated,
                    path: ContentDelivery.categoryPath(translated),
                    localeCode,
                });
            },
        },
        ...metadata,
    );
}

export namespace generateCategoryPageMetadata {
    export type Parameters = Params;
}
