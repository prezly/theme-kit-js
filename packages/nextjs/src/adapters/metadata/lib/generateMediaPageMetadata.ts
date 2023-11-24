import type { Metadata } from 'next';

import type { AppUrlGenerator, Prerequisites } from './types';
import { generatePageMetadata } from './utils';

export type Params = Prerequisites & {
    title: string;
    description?: string;
    generateUrl: AppUrlGenerator;
};

export async function generateMediaPageMetadata(
    { title, description, generateUrl, ...prerequisites }: Params,
    ...metadata: Metadata[]
): Promise<Metadata> {
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
