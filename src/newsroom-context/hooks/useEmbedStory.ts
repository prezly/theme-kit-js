import type { Story } from '@prezly/sdk';

import { useNewsroomContext } from './useNewsroomContext';

export function useEmbedStory(uuid: Story['uuid']) {
    const context = useNewsroomContext();

    if (!context.embedStories) {
        return undefined;
    }

    return context.embedStories[uuid];
}
