import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { CATEGORIES } from '../Navigation/__mocks__';

import { CategoryBlock } from './CategoryBlock';

const DISPLAYED_CATEGORIES: CategoryBlock.DisplayedCategory[] = CATEGORIES.map((category) => ({
    name: category.display_name,
    description: category.display_description,
    href: `/category/${category.display_name.toLowerCase().replace(' ', '-')}`,
}));

export default {
    title: 'Components/CategoryBlock',
    component: CategoryBlock,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/46dEAasj1iEtrVQOwmMswB/00--%3E-Themes-Design-System?type=design&node-id=1361-68432&mode=dev',
        },
    },
} satisfies Meta<typeof CategoryBlock>;

const CategoryBlockTemplate: StoryFn<typeof CategoryBlock> = (args) => <CategoryBlock {...args} />;

export const Default: StoryObj<typeof CategoryBlock> = CategoryBlockTemplate.bind({});
Default.args = {
    category: DISPLAYED_CATEGORIES[2],
};

export const WithoutDescription: StoryObj<typeof CategoryBlock> = CategoryBlockTemplate.bind({});
WithoutDescription.args = {
    category: DISPLAYED_CATEGORIES[0],
};
