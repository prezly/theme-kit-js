// TODO: Re-arrange the types to make them isolated to respective libs where possible
import type { CultureRef, ExtraStoryFields, Story } from '@prezly/sdk';

export interface ServerSidePageProps {
    localeResolved: boolean;
}

export interface AlgoliaCategoryRef {
    id: number;
    name: string;
    slug: string;
}

export type AlgoliaStory = Pick<Story, 'uuid' | 'slug' | 'title' | 'subtitle'> &
    Pick<ExtraStoryFields, 'thumbnail_image'> & {
        content_text: string;
        updated_at: number;
        published_at: number;
        culture: Pick<CultureRef, 'code' | 'name' | 'native_name' | 'language_code'>;
        categories: AlgoliaCategoryRef[];
    };
