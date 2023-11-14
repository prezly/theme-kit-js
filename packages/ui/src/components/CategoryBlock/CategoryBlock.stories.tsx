import type { Meta, StoryFn } from '@storybook/react';

import { CATEGORIES } from '../Navigation/__mocks__';

import { CategoryBlock } from './CategoryBlock';

export default {
    title: 'Components/CategoryBlock',
    component: CategoryBlock,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/46dEAasj1iEtrVQOwmMswB/00--%3E-Themes-Design-System?type=design&node-id=1361-68432&mode=dev',
        },
    },
} as Meta<typeof CategoryBlock>;

const CategoryBlockTemplate: StoryFn<typeof CategoryBlock> = (args) => <CategoryBlock {...args} />;

export const Default = CategoryBlockTemplate.bind({});
Default.args = {
    category: CATEGORIES[2],
    locale: 'en',
};

export const WithoutDescription = CategoryBlockTemplate.bind({});
WithoutDescription.args = {
    category: CATEGORIES[0],
    locale: 'en',
};
