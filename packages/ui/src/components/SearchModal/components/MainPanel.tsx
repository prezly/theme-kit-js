import type { Category, Culture, UploadedImage } from '@prezly/sdk';
import { useSearchBox } from 'react-instantsearch';

import { CategoriesList } from './CategoriesList';
import { SearchResults } from './SearchResults';

export interface Props {
    categories: Category[];
    locale: Culture['code'];
    newsroomName: string;
    logo: UploadedImage | null;
    showDate: boolean;
    hideSubtitle: boolean;
}

export function MainPanel({
    categories,
    locale,
    newsroomName,
    logo,
    showDate,
    hideSubtitle,
}: Props) {
    const { query } = useSearchBox();
    const isQuerySet = Boolean(query?.length);

    if (!isQuerySet && !categories.length) {
        return null;
    }

    return (
        <div className="pt-3 pb-12 px-6">
            {isQuerySet ? (
                <SearchResults
                    locale={locale}
                    newsroomName={newsroomName}
                    logo={logo}
                    showDate={showDate}
                    hideSubtitle={hideSubtitle}
                />
            ) : (
                <CategoriesList categories={categories} locale={locale} />
            )}
        </div>
    );
}
