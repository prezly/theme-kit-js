import { SortOrder } from '@prezly/sdk';

const publishedAndAccessible = [
    { lifecycle_status: { $in: ['published', 'embargo'] } },
    { visibility: { $in: ['public', 'private', 'embargo'] } },
];

const publishedAndPublic = [
    { lifecycle_status: { $in: ['published'] } },
    { visibility: { $in: ['public'] } },
];

export function getSlugQuery(newsroomUuid: string, slug: string) {
    return {
        $and: [
            { 'newsroom.uuid': { $in: [newsroomUuid] } },
            { slug: { $eq: slug } },
            ...publishedAndAccessible,
        ],
    };
}

export function getStoriesQuery(
    newsroomUuid: string,
    categoryId?: number,
    localeCode?: string,
    filterQuery?: Object,
) {
    const query: any = {
        $and: [...publishedAndPublic, { 'newsroom.uuid': { $in: [newsroomUuid] } }],
    };

    if (categoryId) {
        query.$and.push({ 'category.id': { $any: [categoryId] } });
    }

    if (localeCode) {
        query.$and.push({ locale: { $in: [localeCode] } });
    }

    if (filterQuery) {
        query.$and.push(filterQuery);
    }

    return query;
}

export function getChronologicalSortOrder(direction: `${SortOrder.Direction}`, pinning = false) {
    const pinnedFirst = SortOrder.desc('is_pinned');
    const chronological =
        direction === SortOrder.Direction.ASC
            ? SortOrder.asc('published_at')
            : SortOrder.desc('published_at');

    return pinning ? SortOrder.combine(pinnedFirst, chronological) : chronological;
}

export function getGalleriesQuery() {
    return {
        $and: [{ status: { $eq: 'public' } }, { images_number: { $gt: 0 } }],
    };
}

export function getContactsQuery() {
    return {
        $and: [{ is_featured: { $eq: true } }],
    };
}
