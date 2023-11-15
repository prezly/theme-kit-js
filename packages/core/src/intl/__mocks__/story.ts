import type { Story } from '@prezly/sdk';
import { Culture } from '@prezly/sdk';

/**
 * This story data is pulled from The Good Newsroom and reduced to only fields required by tests.
 */
export const STORY: Pick<Story, 'culture'> = {
    culture: {
        code: 'en',
        locale: 'en',
        name: 'English (Global)',
        native_name: 'English (Global)',
        direction: Culture.TextDirection.LTR,
        language_code: 'en',
    },
};
