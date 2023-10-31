import type { Meta, StoryFn } from '@storybook/react';

import { Breadcrumbs } from './Breadcrumbs';
import type { BreadcrumbItem } from './components';

export default {
    title: 'Components/Breadcrumbs',
    component: Breadcrumbs,
} as Meta<typeof Breadcrumbs>;

const ITEMS: BreadcrumbItem[] = [
    { name: 'Homepage', url: '/' },
    { name: 'Media', url: '/media' },
    { name: 'Galileo Art Collection', url: '/media/galileo-art-collection' },
];

const BreadcrumbsTemplate: StoryFn<typeof Breadcrumbs> = (args) => <Breadcrumbs {...args} />;

export const Default = BreadcrumbsTemplate.bind({});
Default.args = {
    items: ITEMS,
};
