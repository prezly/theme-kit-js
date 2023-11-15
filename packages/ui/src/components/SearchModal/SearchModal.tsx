'use client';

import type { Category, Culture, UploadedImage } from '@prezly/sdk';
import * as Dialog from '@radix-ui/react-dialog';
import algoliasearch from 'algoliasearch/lite';
import { useMemo } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch';
import { twMerge } from 'tailwind-merge';

import { MainPanel, SearchBar } from './components';
import type { AlgoliaConfig } from './types';

export function SearchModal({
    isOpen,
    categories,
    className,
    overlayClassName,
    onOpenChange,
    algoliaConfig,
    locale,
    newsroomName,
    logo,
    hideSubtitle,
    showDate,
}: SearchModal.Props) {
    const { ALGOLIA_API_KEY, ALGOLIA_APP_ID, ALGOLIA_INDEX } = algoliaConfig;

    const searchClient = useMemo(
        () => algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY),
        [ALGOLIA_API_KEY, ALGOLIA_APP_ID],
    );

    function handleClose() {
        onOpenChange(false);
    }

    return (
        <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay
                    className={twMerge('fixed inset-0 bg-gray-700 bg-opacity-40', overlayClassName)}
                />
                <Dialog.Content
                    className={twMerge(
                        'fixed top-1/2 left-1/2 w-full h-screen md:max-h-[70vh] md:h-max max-w-[680px] bg-white -translate-x-1/2 -translate-y-1/2 rounded',
                        'overflow-auto',
                        className,
                    )}
                >
                    <InstantSearch searchClient={searchClient} indexName={ALGOLIA_INDEX}>
                        <Configure hitsPerPage={3} filters={`attributes.culture.code:${locale}`} />
                        <SearchBar
                            locale={locale}
                            newsroomName={newsroomName}
                            onClose={handleClose}
                        />
                        <MainPanel
                            categories={categories}
                            locale={locale}
                            logo={logo}
                            hideSubtitle={hideSubtitle}
                            showDate={showDate}
                            newsroomName={newsroomName}
                        />
                    </InstantSearch>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export namespace SearchModal {
    export interface Props {
        isOpen: boolean;
        className?: string;
        overlayClassName?: string;
        onOpenChange: (open: boolean) => void;
        algoliaConfig: AlgoliaConfig;
        locale: Culture['code'];
        newsroomName: string;
        categories: Category[];
        hideSubtitle: boolean;
        showDate: boolean;
        logo: UploadedImage | null;
    }
}
