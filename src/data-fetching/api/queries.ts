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

export function getStoriesQuery(newsroomUuid: string, categoryId?: number, localeCode?: string) {
    const query: any = {
        $and: [...publishedAndPublic, { 'newsroom.uuid': { $in: [newsroomUuid] } }],
    };

    if (categoryId) {
        query.$and.push({ 'category.id': { $any: [categoryId] } });
    }

    if (localeCode) {
        query.$and.push({ locale: { $in: [localeCode] } });
    }

    return query;
}

export function getSortByPublishedDate(order: 'asc' | 'desc') {
    return order === 'desc' ? '-published_at' : 'published_at';
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
