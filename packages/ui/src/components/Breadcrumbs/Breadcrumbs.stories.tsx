import type { Meta, StoryFn } from '@storybook/react';

import { Breadcrumbs } from './Breadcrumbs';
import type { Breadcrumb } from './components';

export default {
    title: 'Components/Breadcrumbs',
    component: Breadcrumbs,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/46dEAasj1iEtrVQOwmMswB/00--%3E-Themes-Design-System?type=design&node-id=649-13409&mode=dev',
        },
    },
} as Meta<typeof Breadcrumbs>;

const ITEMS: Breadcrumb.BreadcrumbItem[] = [
    { name: 'Homepage', url: '/' },
    { name: 'Media', url: '/media' },
    { name: 'Galileo Art Collection', url: '/media/galileo-art-collection' },
];

const BreadcrumbsTemplate: StoryFn<typeof Breadcrumbs> = (args) => <Breadcrumbs {...args} />;

export const Default = BreadcrumbsTemplate.bind({});
Default.args = {
    items: ITEMS,
};
