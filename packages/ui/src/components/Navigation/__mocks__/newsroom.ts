import type { Newsroom } from '@prezly/sdk';

export const NEWSROOM: Pick<
    Newsroom,
    'display_name' | 'public_galleries_number' | 'newsroom_logo'
> = {
    display_name: 'Test site',
    public_galleries_number: 1,
    newsroom_logo: {
        version: 2,
        uuid: '13b5794c-619e-4c6f-961c-0b8e15d771c9',
        filename: 'goodnewsroom-new.png',
        mime_type: 'image/png',
        size: 21659,
        original_width: 916,
        original_height: 331,
        effects: [],
    },
};
