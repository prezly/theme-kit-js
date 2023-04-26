import type { NewsroomGallery } from '@prezly/sdk';

import type { PaginationProps } from './types';
import { useInfiniteLoading } from './useInfiniteLoading.js';

async function fetchGalleries(
    page: number,
    pageSize: number,
): Promise<{ galleries: NewsroomGallery[] }> {
    const result = await fetch('/api/fetch-galleries', {
        method: 'POST',
        headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            page,
            pageSize,
        }),
    });

    if (!result.ok) {
        const { message } = await result.json();
        throw new Error(message);
    }

    return result.json();
}

/**
 * NOTE: This hook depends on the presence of a Next API route (/api/fetch-galleries)!
 * The handler for this route is exported from `apiHandlers/fetchGalleries.ts` file.
 * See https://github.com/prezly/theme-nextjs-bea/blob/d381e9878187ca98815d240d3ffdf10a75993c14/pages/media/index.tsx#L23 for usage example
 */
export function useInfiniteGalleriesLoading(
    initialGalleries: NewsroomGallery[],
    pagination: PaginationProps,
) {
    const { canLoadMore, data, isLoading, loadMore } = useInfiniteLoading<NewsroomGallery>({
        fetchingFn: async (nextPage, pageSize) => {
            const { galleries } = await fetchGalleries(nextPage, pageSize);
            return galleries;
        },
        initialData: initialGalleries,
        pagination,
    });

    return {
        canLoadMore,
        galleries: data,
        isLoading,
        loadMoreGalleries: loadMore,
    };
}
