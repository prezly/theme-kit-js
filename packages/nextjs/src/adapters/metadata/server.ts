import type { AsyncResolvable } from '@prezly/theme-kit-core';
import type { Metadata } from 'next';

import * as lib from './lib';
import type { AbsoluteUrlGenerator, Prerequisites } from './lib';

export namespace MetadataAdapter {
    export type Configuration = Omit<Prerequisites, 'locale'> & {
        generateUrl: AsyncResolvable<AbsoluteUrlGenerator>;
    };

    type WithoutSharedConfiguration<T> = Omit<T, keyof Configuration>;

    export function connect(configuration: Configuration) {
        function generatePageMetadata(
            params: WithoutSharedConfiguration<lib.generatePageMetadata.Parameters> &
                Pick<lib.generatePageMetadata.Parameters, 'generateUrl'>,
            ...metadata: Metadata[]
        ) {
            const { generateUrl, ...prerequisites } = configuration;
            return lib.generatePageMetadata({ ...prerequisites, ...params }, ...metadata);
        }

        function generateRootMetadata(
            params: WithoutSharedConfiguration<lib.generateRootMetadata.Parameters>,
            ...metadata: Metadata[]
        ) {
            return lib.generateRootMetadata({ ...configuration, ...params }, ...metadata);
        }

        function generateStoryPageMetadata(
            params: WithoutSharedConfiguration<lib.generateStoryPageMetadata.Parameters>,
            ...metadata: Metadata[]
        ) {
            return lib.generateStoryPageMetadata({ ...configuration, ...params }, ...metadata);
        }

        function generateCategoryPageMetadata(
            params: WithoutSharedConfiguration<lib.generateCategoryPageMetadata.Parameters>,
            ...metadata: Metadata[]
        ) {
            return lib.generateCategoryPageMetadata({ ...configuration, ...params }, ...metadata);
        }

        function generateMediaPageMetadata(
            params: WithoutSharedConfiguration<lib.generateMediaPageMetadata.Parameters>,
            ...metadata: Metadata[]
        ) {
            return lib.generateMediaPageMetadata({ ...configuration, ...params }, ...metadata);
        }

        function generateMediaGalleryPageMetadata(
            params: WithoutSharedConfiguration<lib.generateMediaGalleryPageMetadata.Parameters>,
            ...metadata: Metadata[]
        ) {
            return lib.generateMediaGalleryPageMetadata(
                { ...configuration, ...params },
                ...metadata,
            );
        }

        function generateSearchPageMetadata(
            params: WithoutSharedConfiguration<lib.generateSearchPageMetadata.Parameters>,
            ...metadata: Metadata[]
        ) {
            return lib.generateSearchPageMetadata({ ...configuration, ...params }, ...metadata);
        }

        return {
            // generic
            mergePageMetadata: lib.mergePageMetadata,
            generateAlternateLanguageLinks: lib.generateAlternateLanguageLinks,
            // bound to prerequisites
            generatePageMetadata,
            generateRootMetadata,
            generateStoryPageMetadata,
            generateCategoryPageMetadata,
            generateMediaPageMetadata,
            generateMediaGalleryPageMetadata,
            generateSearchPageMetadata,
        };
    }
}
