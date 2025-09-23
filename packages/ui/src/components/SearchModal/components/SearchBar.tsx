'use client';

import { ArrowLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { Culture } from '@prezly/sdk';
import { useState } from 'react';
import { useSearchBox } from 'react-instantsearch';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useDevice } from '@/hooks';

const SEARCH_PAGE_URL = 'search';

export function SearchBar({ locale, newsroomName, onClose, intl = {} }: SearchBar.Props) {
    const { refine, query } = useSearchBox();
    const [input, setInput] = useState(query);
    const { isMd } = useDevice();

    const action = locale ? `/${locale}/${SEARCH_PAGE_URL}` : `/${SEARCH_PAGE_URL}`;

    function setQuery(value: string) {
        setInput(value);

        refine(value);
    }

    return (
        <form
            className="flex items-center p-6 gap-4 border-b border-gray-200"
            action={action}
            method="GET"
        >
            {!isMd && <Button variation="navigation" icon={ArrowLeftIcon} onClick={onClose} />}
            <Input
                autoComplete="off"
                className="w-full border border-gray-200 rounded px-3 py-2"
                icon={isMd ? MagnifyingGlassIcon : undefined}
                inputClassName="p-1 focus:outline-transparent focus-within:outline-transparent focus-visible:outline-0"
                name="query"
                onChange={(event) => setQuery(event.currentTarget.value)}
                placeholder={intl['search.inputHint'] ?? `Search ${newsroomName}...`}
                type="search"
                value={input}
            />
            <Button type="submit">{intl['search.action'] ?? 'Search'}</Button>
        </form>
    );
}

export namespace SearchBar {
    export interface Intl {
        'search.action': string;
        'search.inputHint': string;
    }

    export interface Props {
        locale?: Culture['code'];
        newsroomName: string;
        onClose: () => void;
        intl?: Partial<Intl>;
    }
}
