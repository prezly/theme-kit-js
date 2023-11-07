'use client';

import type { Culture } from '@prezly/sdk';
import * as Dialog from '@radix-ui/react-dialog';
import algoliasearch from 'algoliasearch/lite';
import { useMemo } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch';
import { twMerge } from 'tailwind-merge';

import { MainPanel, SearchBar } from './components';
import type { AlgoliaConfig } from './types';

export interface Props {
    isOpen: boolean;
    className?: string;
    overlayClassName?: string;
    onOpenChange: (open: boolean) => void;
    algoliaConfig: AlgoliaConfig;
    locale?: Culture['code'];
    newsroom: string;
}

export function SearchModal({
    isOpen,
    className,
    overlayClassName,
    onOpenChange,
    algoliaConfig,
    locale,
    newsroom,
}: Props) {
    const { ALGOLIA_API_KEY, ALGOLIA_APP_ID, ALGOLIA_INDEX } = algoliaConfig;

    const searchClient = useMemo(
        () => algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY),
        [ALGOLIA_API_KEY, ALGOLIA_APP_ID],
    );

    return (
        <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay
                    className={twMerge('fixed inset-0 bg-gray-700 bg-opacity-40', overlayClassName)}
                />
                <Dialog.Content
                    className={twMerge(
                        'fixed top-1/2 left-1/2 max-h-[70vh] w-[90vw] max-w-[880px] bg-white -translate-x-1/2 -translate-y-1/2 rounded',
                        className,
                    )}
                >
                    <InstantSearch searchClient={searchClient} indexName={ALGOLIA_INDEX}>
                        <Configure hitsPerPage={3} filters={`attributes.culture.code:${locale}`} />
                        <SearchBar locale={locale} newsroom={newsroom} />
                        <MainPanel />
                    </InstantSearch>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
