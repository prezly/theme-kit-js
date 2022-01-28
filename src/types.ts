// TODO: Re-arrange the types to make them isolated to respective libs where possible
import type { AlgoliaSettings } from './data-fetching';
import type {
    Category,
    CultureRef,
    ExtraStoryFields,
    Newsroom,
    NewsroomCompanyInformation,
    NewsroomContact,
    NewsroomLanguageSettings,
    NewsroomThemePreset,
    Story,
} from '@prezly/sdk';

export interface BasePageProps {
    newsroom: Newsroom;
    companyInformation: NewsroomCompanyInformation;
    categories: Category[];
    languages: NewsroomLanguageSettings[];
    localeCode: string;
    /**
     * `false` means it's the default locale
     */
    shortestLocaleCode: string | false;
    localeResolved: boolean;
    themePreset: NewsroomThemePreset;
    algoliaSettings: AlgoliaSettings;
    translations?: Translations;
    contacts?: NewsroomContact[];
    isTrackingEnabled?: boolean;
    selectedCategory?: Category;
    selectedStory?: Story;
}

export interface PaginationProps {
    itemsTotal: number;
    currentPage: number;
    pageSize: number;
}

export type StoryWithImage = Story & Pick<ExtraStoryFields, 'thumbnail_image'>;

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

export type Translations = Record<string, string>;
