import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { Breadcrumbs } from './Breadcrumbs';

export default {
    title: 'Components/Breadcrumbs',
    component: Breadcrumbs,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/46dEAasj1iEtrVQOwmMswB/00--%3E-Themes-Design-System?type=design&node-id=649-13409&mode=dev',
        },
    },
} satisfies Meta<typeof Breadcrumbs>;

const ITEMS: Breadcrumbs.Item[] = [
    { name: 'Homepage', href: '/' },
    { name: 'Media', href: '/media' },
    { name: 'Galileo Art Collection', href: '/media/galileo-art-collection' },
];

const BreadcrumbsTemplate: StoryFn<typeof Breadcrumbs> = (args) => <Breadcrumbs {...args} />;

export const Default: StoryObj<typeof Breadcrumbs> = BreadcrumbsTemplate.bind({});
Default.args = {
    items: ITEMS,
};
