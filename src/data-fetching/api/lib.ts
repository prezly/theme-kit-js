export function toPaginationParams(params: {
    page?: number;
    pageSize?: number;
    withHighlightedStory?: boolean;
}) {
    const { page = 1, pageSize, withHighlightedStory = false } = params;

    if (!pageSize) {
        return { offset: undefined, limit: undefined };
    }

    const offset = pageSize * (page - 1);
    const limit = pageSize;

    if (withHighlightedStory && page === 1) {
        return { offset: 0, limit: limit + 1 };
    }

    if (withHighlightedStory && page > 1) {
        return { offset: offset + 1, limit };
    }

    return { offset, limit };
}
