'use client';

import type { Culture, UploadedImage } from '@prezly/sdk';
import type { AlgoliaStory } from '@prezly/theme-kit-core';
import { Hits, useInstantSearch, useSearchBox } from 'react-instantsearch';

import { ButtonLink } from '@/components/Button';

import { Hit } from './Hit';

export interface Props {
    locale: Culture['code'];
    newsroomName: string;
    logo: UploadedImage | null;
    hideSubtitle: boolean;
    showDate: boolean;
}

export function SearchResults({ locale, newsroomName, logo, hideSubtitle, showDate }: Props) {
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
                    <Hit
                        hit={hit}
                        locale={locale}
                        logo={logo}
                        showDate={showDate}
                        hideSubtitle={hideSubtitle}
                        newsroomName={newsroomName}
                    />
                )}
            />

            {totalResults > 3 && (
                <ButtonLink
                    className="mt-6 w-max"
                    href={`/search?query=${query}`}
                    variation="primary"
                    forceRefresh={isOnSearchPage}
                >
                    View all {totalResults} results
                </ButtonLink>
            )}
        </>
    );
}
