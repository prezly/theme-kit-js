import type { Metadata } from 'next';

import * as lib from './lib';
import type { AppUrlGenerator, Prerequisites } from './lib';

export namespace MetadataAdapter {
    export type Configuration = Prerequisites & {
        generateUrl: AppUrlGenerator;
    };

    type WithoutPrerequisites<T> = Omit<T, keyof Prerequisites>;
    type WithoutSharedConfiguration<T> = Omit<T, keyof Configuration>;

    export function connect(configuration: Configuration) {
        function generatePageMetadata(
            params: WithoutPrerequisites<lib.generatePageMetadata.Parameters> = {},
            ...metadata: Metadata[]
        ) {
            const { generateUrl, ...prerequisites } = configuration;
            return lib.generatePageMetadata({ ...prerequisites, ...params }, ...metadata);
        }

        function generateRootMetadata(
            params: WithoutSharedConfiguration<lib.generateRootMetadata.Parameters> = {},
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

        function generateMediaAlbumPageMetadata(
            params: WithoutSharedConfiguration<lib.generateMediaAlbumPageMetadata.Parameters>,
            ...metadata: Metadata[]
        ) {
            return lib.generateMediaAlbumPageMetadata({ ...configuration, ...params }, ...metadata);
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
            generateMediaAlbumPageMetadata,
            generateSearchPageMetadata,
        };
    }
}
