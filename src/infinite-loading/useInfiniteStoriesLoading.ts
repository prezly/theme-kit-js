import type { Category, Story } from '@prezly/sdk';
import { useEffect } from 'react';

import type { LocaleObject } from '../intl';
import { useCurrentLocale } from '../newsroom-context';

import type { PaginationProps } from './types';
import { useInfiniteLoading } from './useInfiniteLoading';

async function fetchStories<T extends Story = Story>(
    page: number,
    pageSize: number,
    withHighlightedStory: boolean,
    category?: Category,
    locale?: LocaleObject,
    include?: (keyof Story.ExtraFields)[],
    pinning?: boolean,
): Promise<{ stories: T[] }> {
    const result = await fetch('/api/fetch-stories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            page,
            pageSize,
            withHighlightedStory,
            category,
            include,
            pinning,
            ...(locale && {
                localeCode: locale.toUnderscoreCode(),
            }),
        }),
    });

    if (!result.ok) {
        const { message } = await result.json();
        throw new Error(message);
    }

    return result.json();
}

/**
 * NOTE: This hook depends on the presence of a Next API route (/api/fetch-stories)!
 * The handler for this route is exported from `apiHandlers/fetchStories.ts` file.
 * See https://github.com/prezly/theme-nextjs-bea/blob/d381e9878187ca98815d240d3ffdf10a75993c14/pages/index.tsx#L24 for usage example
 */
export function useInfiniteStoriesLoading<T extends Story = Story>(
    initialStories: T[],
    pagination: PaginationProps,
    category?: Category,
    include?: (keyof Story.ExtraFields)[],
    pinning?: boolean,
) {
    const currentLocale = useCurrentLocale();
    const { withHighlightedStory = false } = pagination;

    const { canLoadMore, data, isLoading, loadMore, resetData } = useInfiniteLoading<T>({
        fetchingFn: async (nextPage, pageSize) => {
            const { stories } = await fetchStories<T>(
                nextPage,
                pageSize,
                withHighlightedStory,
                category,
                currentLocale,
                include,
                pinning,
            );
            return stories;
        },
        initialData: initialStories,
        pagination,
    });

    useEffect(() => {
        if (category?.id) {
            resetData();
        }
    }, [category?.id, resetData]);

    return {
        canLoadMore,
        isLoading,
        loadMoreStories: loadMore,
        stories: data,
    };
}
