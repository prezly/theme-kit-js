import { assertServerEnv } from '@prezly/theme-kit-core';
import type { NextApiRequest, NextApiResponse } from 'next';

import { NextContentDelivery } from '../../data-fetching';

export async function fetchStories(req: NextApiRequest, res: NextApiResponse) {
    assertServerEnv('fetchStories');

    if (req.method !== 'POST') {
        res.status(405);
        return;
    }

    const {
        page,
        pageSize,
        withHighlightedStory,
        category,
        include,
        formats,
        locale,
        pinning,
        filterQuery,
    } = req.body;

    try {
        const api = NextContentDelivery.initClient(req, { pinning, formats });

        const { stories, pagination } = await api.stories(
            {
                category,
                offset: (page - 1) * pageSize,
                limit: pageSize,
                locale,
                highlighted: withHighlightedStory ? 1 : 0,
                query: filterQuery,
            },
            {
                include,
            },
        );

        res.status(200).json({ stories, storiesTotal: pagination.matched_records_number });
    } catch (error) {
        res.status(500).send({
            message: (error as Error).message,
        });
    }
}
