import type { Meta, StoryFn } from '@storybook/react';

import type { Breadcrumbs } from '../Breadcrumbs';

import { PageTitle } from './PageTitle';

export default {
    title: 'Components/PageTitle',
    component: PageTitle,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/46dEAasj1iEtrVQOwmMswB/00--%3E-Themes-Design-System?type=design&node-id=660-16925&mode=dev',
        },
    },
} as Meta<typeof PageTitle>;

const PageTitleTemplate: StoryFn<typeof PageTitle> = (args) => <PageTitle {...args} />;

const ITEMS: Breadcrumbs.Item[] = [
    { name: 'Homepage', href: '/' },
    { name: 'Media', href: '/media' },
    { name: 'Galileo Art Collection', href: '/media/galileo-art-collection' },
];

export const Default = PageTitleTemplate.bind({});
Default.args = {
    title: 'Section Title',
    description: 'Section Description',
    breadcrumbs: ITEMS,
};
