import type { Category, Culture } from '@prezly/sdk';
import { useSearchBox } from 'react-instantsearch';

import { CategoriesList } from './CategoriesList';
import { SearchResults } from './SearchResults';

export interface Props {
    categories: Category[];
    locale: Culture['code'];
    newsroomName: string;
}

export function MainPanel({ categories, locale, newsroomName }: Props) {
    const { query } = useSearchBox();
    const isQuerySet = Boolean(query?.length);

    if (!isQuerySet && !categories.length) {
        return null;
    }

    return (
        <div className="pt-3 pb-12 px-6">
            {isQuerySet ? (
                <SearchResults locale={locale} newsroomName={newsroomName} />
            ) : (
                <CategoriesList categories={categories} locale={locale} />
            )}
        </div>
    );
}
