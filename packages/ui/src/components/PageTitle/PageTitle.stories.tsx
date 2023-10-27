import type { Meta, StoryFn } from '@storybook/react';

import type { BreadcrumbItem } from '../Breadcrumbs';

import { PageTitle } from '.';

export default {
    title: 'Components/PageTitle',
    component: PageTitle,
} as Meta<typeof PageTitle>;

const PageTitleTemplate: StoryFn<typeof PageTitle> = (args) => <PageTitle {...args} />;

const ITEMS: BreadcrumbItem[] = [
    { name: 'Homepage', url: '/' },
    { name: 'Media', url: '/media' },
    { name: 'Galileo Art Collection', url: '/media/galileo-art-collection' },
];

export const Default = PageTitleTemplate.bind({});
Default.args = {
    title: 'Section Title',
    description: 'Section Description',
    breadcrumbItems: ITEMS,
};
