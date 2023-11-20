'use client';

import type { Culture, UploadedImage } from '@prezly/sdk';
import { Hits, useInstantSearch, useSearchBox } from 'react-instantsearch';

import { ButtonLink } from '@/components/Button';
import type { AlgoliaStory } from '@/types';

import { Hit } from './Hit';

export function SearchResults({
    locale,
    newsroomName,
    logo,
    showSubtitle = true,
    showDate,
    intl = {},
}: SearchResults.Props) {
    const { results } = useInstantSearch();
    const { query } = useSearchBox();
    const totalResults = results?.nbHits ?? 0;

    const isOnSearchPage = window.location.pathname.includes('/search');

    return (
        <>
            <p className="subtitle-small text-gray-600">
                {totalResults ? (
                    <span>{intl['search.fullResultsTitle'] ?? 'Quick results'}</span>
                ) : (
                    <span>{intl['search.noResults'] ?? 'No results found'}</span>
                )}
            </p>

            <Hits<{ attributes: AlgoliaStory }>
                hitComponent={({ hit }) => (
                    <Hit
                        hit={hit}
                        locale={locale}
                        logo={logo}
                        showDate={showDate}
                        showSubtitle={showSubtitle}
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
                    {intl['search.showAllResults'] ?? `View all ${totalResults} results`}
                </ButtonLink>
            )}
        </>
    );
}

export namespace SearchResults {
    export interface Intl {
        ['search.fullResultsTitle']: string;
        ['search.noResults']: string;
        ['search.showAllResults']: string;
    }

    export interface Props {
        locale: Culture['code'];
        newsroomName: string;
        logo: UploadedImage | null;
        showSubtitle?: boolean;
        showDate: boolean;
        intl?: Partial<Intl>;
    }
}
