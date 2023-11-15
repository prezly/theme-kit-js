import type { Category, Culture, UploadedImage } from '@prezly/sdk';
import { useSearchBox } from 'react-instantsearch';

import { CategoriesList } from './CategoriesList';
import { SearchResults } from './SearchResults';

export function MainPanel({
    categories,
    locale,
    newsroomName,
    logo,
    showDate,
    hideSubtitle,
}: MainPanel.Props) {
    const { query } = useSearchBox();
    const isQuerySet = Boolean(query?.length);

    if (!isQuerySet && !categories.length) {
        return null;
    }

    const displayedCategories: CategoriesList.DisplayedCategory[] = categories.map((category) => ({
        id: category.id,
        name: category.display_name,
        href: `/category/${category.display_name.toLowerCase()}`, // TODO: Lift URL generation from here
    }));

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
                <CategoriesList categories={displayedCategories} />
            )}
        </div>
    );
}

export namespace MainPanel {
    export interface Props {
        categories: Category[];
        locale: Culture['code'];
        newsroomName: string;
        logo: UploadedImage | null;
        showDate: boolean;
        hideSubtitle: boolean;
    }
}
