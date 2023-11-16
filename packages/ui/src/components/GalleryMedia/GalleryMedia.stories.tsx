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

const DISPLAYED_GALLERY: GalleryMedia.DisplayedGallery = {
    name: GALLERY.name,
    href: `/gallery/album/${GALLERY.uuid}`,
    images: GALLERY.images_number,
    videos: GALLERY.videos_number,
};

const GalleryMediaTemplate: StoryFn<typeof GalleryMedia> = (args) => <GalleryMedia {...args} />;

export const Default = GalleryMediaTemplate.bind({});
Default.args = {
    gallery: DISPLAYED_GALLERY,
};

export const WithOnlyImages = GalleryMediaTemplate.bind({});
WithOnlyImages.args = {
    gallery: { ...DISPLAYED_GALLERY, videos: 0 },
};

export const WithoutImages = GalleryMediaTemplate.bind({});
WithoutImages.args = {
    gallery: { ...DISPLAYED_GALLERY, images: 0 },
};
