'use client';

import type { Culture, UploadedImage } from '@prezly/sdk';
import * as Dialog from '@radix-ui/react-dialog';
import algoliasearch from 'algoliasearch/lite';
import { useMemo } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch';
import { twMerge } from 'tailwind-merge';

import { MainPanel, SearchBar } from './components';
import type { AlgoliaSettings } from './types';

export function SearchModal({
    isOpen,
    categories,
    className,
    overlayClassName,
    onToggle,
    algoliaConfig,
    locale,
    newsroomName,
    logo,
    showSubtitle = true,
    showDate,
}: SearchModal.Props) {
    const { apiKey, appId, index } = algoliaConfig;

    const searchClient = useMemo(() => algoliasearch(appId, apiKey), [apiKey, appId]);

    function handleClose() {
        onToggle(false);
    }

    return (
        <Dialog.Root open={isOpen} onOpenChange={onToggle}>
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
                    <InstantSearch searchClient={searchClient} indexName={index}>
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
                            showSubtitle={showSubtitle}
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
    export type DisplayedCategory = MainPanel.DisplayedCategory;

    export interface Props {
        isOpen: boolean;
        className?: string;
        overlayClassName?: string;
        onToggle: (open: boolean) => void;
        algoliaConfig: AlgoliaSettings;
        locale: Culture['code'];
        newsroomName: string;
        categories: DisplayedCategory[];
        showSubtitle?: boolean;
        showDate: boolean;
        logo: UploadedImage | null;
    }
}
