'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { Culture } from '@prezly/sdk';
import { useState } from 'react';
import { useSearchBox } from 'react-instantsearch';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export interface Props {
    locale?: Culture['code'];
    newsroomName: string;
}

const SEARCH_PAGE_URL = 'search';

export function SearchBar({ locale, newsroomName }: Props) {
    const { refine, query } = useSearchBox();
    const [input, setInput] = useState(query);

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
            <Input
                autoComplete="off"
                className="w-full"
                icon={MagnifyingGlassIcon}
                inputClassName="px-4 py-3"
                name="query"
                onChange={(event) => setQuery(event.currentTarget.value)}
                // TODO: add translations
                placeholder={`Search ${newsroomName}...`}
                type="search"
                value={input}
            />
            {/* TODO: Add translations */}
            <Button type="submit">Search</Button>
        </form>
    );
}
