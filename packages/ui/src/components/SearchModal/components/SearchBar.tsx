'use client';

import type { Culture } from '@prezly/sdk';
import { useSearchBox } from 'react-instantsearch';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export interface Props {
    locale?: Culture['code'];
    newsroom: string;
}

const SEARCH_PAGE_URL = 'search';

export function SearchBar({ locale, newsroom }: Props) {
    const { refine, query } = useSearchBox();

    const action = locale ? `/${locale}/${SEARCH_PAGE_URL}` : `/${SEARCH_PAGE_URL}`;

    return (
        <form className="flex items-center p-6 gap-4" action={action} method="GET">
            <Input
                autoComplete="off"
                className="w-full border border-gray-200 rounded"
                inputClassName="px-4 py-3"
                name="query"
                onChange={(event) => refine(event.currentTarget.value)}
                // TODO: add translations
                placeholder={`Search ${newsroom}...`}
                type="search"
                value={query}
            />
            {/* TODO: Add translations */}
            <Button type="submit">Search</Button>
        </form>
    );
}
