import { AsyncResolvable } from '@prezly/theme-kit-core';
import type { Metadata } from 'next';

import type { AppUrlGenerator, Prerequisites } from './types';
import { generatePageMetadata } from './utils';

export type Params = Prerequisites & {
    title: string;
    description?: string;
    generateUrl: AsyncResolvable<AppUrlGenerator>;
};

export async function generateMediaPageMetadata(
    { title, description, generateUrl: resolvableUrlGenerator, ...prerequisites }: Params,
    ...metadata: Metadata[]
): Promise<Metadata> {
    const generateUrl = await AsyncResolvable.resolve(resolvableUrlGenerator);

    return generatePageMetadata(
        {
            ...prerequisites,
            title,
            description,
            generateUrl: (localeCode) => generateUrl('media', { localeCode }),
        },
        ...metadata,
    );
}

export namespace generateMediaPageMetadata {
    export type Parameters = Params;
}
