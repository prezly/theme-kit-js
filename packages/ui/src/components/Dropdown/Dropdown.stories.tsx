import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { Dropdown } from '.';

const meta: Meta<typeof Dropdown> = {
    title: 'Forms/Dropdown',
    component: Dropdown,
    decorators: [
        (Story) => (
            <div className="bg-gray-100 p-10">
                <Story />
            </div>
        ),
    ],
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/46dEAasj1iEtrVQOwmMswB/00--%3E-Themes-Design-System?type=design&node-id=633-23947&mode=dev',
        },
    },
};
export default meta;

const ITEMS = [
    'All categories',
    'Product releases',
    'Events',
    'Awards',
    'Research and development',
    'Healthcare',
    'Artificial intelligence',
];

const DropdownTemplate: StoryFn<typeof Dropdown> = (args) => (
    <Dropdown {...args}>
        <Dropdown.Group>
            {ITEMS.map((item) => (
                <Dropdown.Item key={item}>{item}</Dropdown.Item>
            ))}
        </Dropdown.Group>
    </Dropdown>
);

export const Default: StoryObj<typeof Dropdown> = DropdownTemplate.bind({});
Default.args = {
    label: 'Categories',
};
