import type { NewsroomGallery } from '@prezly/sdk';
import { SortOrder } from '@prezly/sdk';

const publishedAndAccessible = [
    { status: { $in: ['published', 'embargo'] } },
    { visibility: { $in: ['public', 'private', 'embargo'] } },
];

const publishedAndPublic = [
    { status: { $in: ['published'] } },
    { visibility: { $in: ['public'] } },
];

export function getSlugQuery(newsroomUuid: string, slug: string) {
    return {
        $and: [
            // eslint-disable-next-line @typescript-eslint/naming-convention
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
        // eslint-disable-next-line @typescript-eslint/naming-convention
        $and: [...publishedAndPublic, { 'newsroom.uuid': { $in: [newsroomUuid] } }],
    };

    if (categoryId) {
        // eslint-disable-next-line @typescript-eslint/naming-convention
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

export function getGalleriesQuery(type?: `${NewsroomGallery.Type}`) {
    const conditions: Object[] = [{ status: { $eq: 'public' } }, { is_empty: { $eq: false } }];

    if (type) {
        conditions.push({ type });
    }

    return {
        $and: conditions,
    };
}

export function getContactsQuery() {
    return {
        $and: [{ is_featured: { $eq: true } }],
    };
}
