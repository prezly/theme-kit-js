import type { Culture, UploadedImage } from '@prezly/sdk';
import { useSearchBox } from 'react-instantsearch';

import { CategoriesList } from './CategoriesList';
import { SearchResults } from './SearchResults';

export function MainPanel({
    categories,
    locale,
    newsroomName,
    logo,
    showDate,
    showSubtitle = true,
}: MainPanel.Props) {
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
                    showSubtitle={showSubtitle}
                />
            ) : (
                <CategoriesList categories={categories} />
            )}
        </div>
    );
}

export namespace MainPanel {
    export type DisplayedCategory = CategoriesList.DisplayedCategory;

    export interface Props {
        categories: DisplayedCategory[];
        locale: Culture['code'];
        newsroomName: string;
        logo: UploadedImage | null;
        showDate: boolean;
        showSubtitle?: boolean;
    }
}
