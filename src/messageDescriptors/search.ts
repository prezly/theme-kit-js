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
    inputLabel: {
        id: 'search.inputLabel',
        defaultMessage: 'Search newsroom',
    },
    inputHint: {
        id: 'search.inputHint',
        defaultMessage: 'Type your search {inputHintExtra}',
        description:
            '{inputHintExtra} variable will contain the text from `search.inputHintExtra` string wrapped in a container. This part of the text can either be shown or hidden to fit on the screen. Please construct the sentence in a way that makes sense with both the extra part present and hidden',
    },
    inputHintExtra: {
        id: 'search.inputHintExtra',
        defaultMessage: 'and press {keyHint} or click {buttonLabel}',
        description:
            '{keyHint} variable will be replaced with an icon of Enter key, the {buttonLabel} variable will refer to the "Search" action',
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
        defaultMessage: 'We found {resultsCount} results for &quot;{searchQuery}&quot;',
        description: '`&quot;` is an HTML-escaped quotation mark. Please try to preserve those or use other HTML-escaped characters for other quote types'
    }
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
    }
})