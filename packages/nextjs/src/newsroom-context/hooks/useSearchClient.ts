import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import algoliasearch from 'algoliasearch';


import { useSearchSettings } from './useSearchSettings';

export function useSearchClient() {
    const settings = useSearchSettings();

    if (!settings) {
        return null;
    }

    return settings.searchBackend === 'algolia'
        ? algoliasearch(settings.appId, settings.apiKey)
        : instantMeiliSearch(settings.host, settings.apiKey).searchClient;
}
