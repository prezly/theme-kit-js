import type { Metadata } from 'next';

import * as lib from './lib';
import type { Prerequisites } from './lib';

type WithoutPrerequisites<T> = Omit<T, keyof Prerequisites>;

export namespace MetadataAdapter {
    export type Configuration = Prerequisites;

    export function connect({ ...prerequisites }: Configuration) {
        function generatePageMetadata(
            params: WithoutPrerequisites<lib.generatePageMetadata.Parameters> = {},
            ...metadata: Metadata[]
        ) {
            return lib.generatePageMetadata({ ...prerequisites, ...params }, ...metadata);
        }

        function generateRootMetadata(
            params: WithoutPrerequisites<lib.generateRootMetadata.Parameters> = {},
            ...metadata: Metadata[]
        ) {
            return lib.generateRootMetadata({ ...prerequisites, ...params }, ...metadata);
        }

        function generateStoryPageMetadata(
            params: WithoutPrerequisites<lib.generateStoryPageMetadata.Parameters>,
            ...metadata: Metadata[]
        ) {
            return lib.generateStoryPageMetadata({ ...prerequisites, ...params }, ...metadata);
        }

        return {
            // generic
            mergePageMetadata: lib.mergePageMetadata,
            generateAlternateLanguageLinks: lib.generateAlternateLanguageLinks,
            // bound to prerequisites
            generatePageMetadata,
            generateRootMetadata,
            generateStoryPageMetadata,
        };
    }
}
