import type { Meta, StoryFn } from '@storybook/react';

import { GalleryTitle } from './GalleryTitle';

export default {
    title: 'Components/GalleryTitle',
    component: GalleryTitle,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/46dEAasj1iEtrVQOwmMswB/00--%3E-Themes-Design-System?type=design&node-id=705-25691&mode=dev',
        },
    },
} as Meta<typeof GalleryTitle>;

const GalleryTitleTemplate: StoryFn<typeof GalleryTitle> = (args) => <GalleryTitle {...args} />;

export const Default = GalleryTitleTemplate.bind({});
Default.args = {
    gallery: {
        name: 'Galileo Art Collection',
        description:
            'Galileo, a renowned pioneer in the artificial intelligence landscape, announced the groundbreaking release of ShopAI.',
        downloadHref: 'https://cdn.uc.assets.prezly.com/test',
    },
};
