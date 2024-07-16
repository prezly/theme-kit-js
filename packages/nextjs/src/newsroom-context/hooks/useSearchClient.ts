import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import type { SearchSettings } from '@prezly/theme-kit-core/server';
import algoliasearch from 'algoliasearch';

export function useSearchClient(settings: SearchSettings) {
    return settings.searchBackend === 'algolia'
        ? algoliasearch(settings.appId, settings.apiKey)
        : instantMeiliSearch(settings.host, settings.apiKey).searchClient;
}
