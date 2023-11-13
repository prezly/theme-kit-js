import type { Meta, StoryFn } from '@storybook/react';

import { GALLERY } from './__mocks__';
import { GalleryMedia } from './GalleryMedia';

export default {
    title: 'Components/GalleryMedia',
    component: GalleryMedia,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/46dEAasj1iEtrVQOwmMswB/00--%3E-Themes-Design-System?type=design&node-id=1361-46136&mode=dev',
        },
    },
} as Meta<typeof GalleryMedia>;

const GalleryMediaTemplate: StoryFn<typeof GalleryMedia> = (args) => <GalleryMedia {...args} />;

export const Default = GalleryMediaTemplate.bind({});
Default.args = {
    gallery: { ...GALLERY, videos_number: 2 },
};

export const WithOnlyImages = GalleryMediaTemplate.bind({});
WithOnlyImages.args = {
    gallery: GALLERY,
};

export const WithoutImages = GalleryMediaTemplate.bind({});
WithoutImages.args = {
    gallery: { ...GALLERY, images_number: 0, videos_number: 0 },
};
