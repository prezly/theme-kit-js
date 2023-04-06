import type { NextApiRequest, NextApiResponse } from 'next';

import { getNextPrezlyApi } from '../../data-fetching';

export async function fetchStories(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405);
        return;
    }

    const { page, pageSize, withHighlightedStory, category, include, localeCode, pinning } =
        req.body;

    try {
        const api = getNextPrezlyApi(req);

        const { stories } = await (category
            ? api.getStoriesFromCategory(category, { page, pageSize, include, localeCode })
            : api.getStories({
                  page,
                  pageSize,
                  include,
                  localeCode,
                  withHighlightedStory,
                  pinning,
              }));

        res.status(200).json({ stories });
    } catch (error) {
        res.status(500).send({
            message: (error as Error).message,
        });
    }
}
