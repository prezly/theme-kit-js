import { defineMessages } from '@formatjs/intl';

export const search = defineMessages({
    title: {
        id: 'search.title',
        defaultMessage: 'Search',
        description: 'The word should be treated as a noun (e.g. a title of the Search section)',
    },
    action: {
        id: 'search.action',
        defaultMessage: 'Search',
        description: 'The word should be treated as a verb (e.g. a Search action on a button)',
    },
    filters: {
        id: 'search.filters',
        defaultMessage: 'Filters',
    },
    inputLabel: {
        id: 'search.inputLabel',
        defaultMessage: 'Search site',
    },
    inputHint: {
        id: 'search.inputHint',
        defaultMessage: 'Type your search',
    },
    resultsTitle: {
        id: 'search.resultsTitle',
        defaultMessage: 'Quick results',
    },
    noResults: {
        id: 'search.noResults',
        defaultMessage: 'Nothing found! Please try another search term!',
    },
    showAllResults: {
        id: 'search.showAllResults',
        defaultMessage: 'Show all results',
    },
    viewMore: {
        id: 'search.viewMore',
        defaultMessage: 'View more',
    },
    viewLess: {
        id: 'search.viewLess',
        defaultMessage: 'View less',
    },
    fullResultsTitle: {
        id: 'search.fullResultsTitle',
        defaultMessage: 'Search results',
    },
    fullResultsSubTitle: {
        id: 'search.fullResultsSubTitle',
        defaultMessage: 'We found {resultsCount} results for {searchQuery}',
    },
});

export const searchFacets = defineMessages({
    category: {
        id: 'search.facets.category',
        defaultMessage: 'Category',
    },
    year: {
        id: 'search.facets.year',
        defaultMessage: 'Year',
    },
    month: {
        id: 'search.facets.month',
        defaultMessage: 'Month',
    },
});
