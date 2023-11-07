'use client';

import type { Culture } from '@prezly/sdk';
import type { AlgoliaStory } from '@prezly/theme-kit-core';
import { Hits, useInstantSearch, useSearchBox } from 'react-instantsearch';

import { ButtonLink } from '@/components/Button';

import { Hit } from './Hit';

export interface Props {
    locale: Culture['code'];
    newsroomName: string;
}

export function SearchResults({ locale, newsroomName }: Props) {
    const { results } = useInstantSearch();
    const { query } = useSearchBox();
    const totalResults = results?.nbHits ?? 0;

    const isOnSearchPage = window.location.pathname.includes('/search');

    return (
        <>
            <p className="subtitle-small text-gray-600">
                {/* TODO: Add translations */}
                {totalResults ? <span>Quick results</span> : <span>No results found</span>}
            </p>

            <Hits<{ attributes: AlgoliaStory }>
                hitComponent={({ hit }) => (
                    <Hit hit={hit} locale={locale} newsroomName={newsroomName} />
                )}
            />

            {totalResults > 3 && (
                <ButtonLink
                    className="mt-6"
                    href={`/search?query=${query}`}
                    variation="secondary"
                    forceRefresh={isOnSearchPage}
                >
                    View all {totalResults} results
                </ButtonLink>
            )}
        </>
    );
}
