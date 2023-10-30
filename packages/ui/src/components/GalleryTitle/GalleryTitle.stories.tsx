import type { Meta, StoryFn } from '@storybook/react';

import { GalleryTitle } from './GalleryTitle';

export default {
    title: 'Components/GalleryTitle',
    component: GalleryTitle,
} as Meta<typeof GalleryTitle>;

const GalleryTitleTemplate: StoryFn<typeof GalleryTitle> = (args) => <GalleryTitle {...args} />;

export const Default = GalleryTitleTemplate.bind({});
Default.args = {
    gallery: {
        name: 'Galileo Art Collection',
        description:
            'Galileo, a renowned pioneer in the artificial intelligence landscape, announced the groundbreaking release of ShopAI.',
        uploadcare_group_uuid: '1f58fd2e-04d4-4ce3-8b69-6407c30083c0',
    } as any,
};
