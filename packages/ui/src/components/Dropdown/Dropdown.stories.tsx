import type { Meta, StoryFn } from '@storybook/react';

import { Dropdown } from '.';

export default {
    title: 'Forms/Dropdown',
    component: Dropdown,
    decorators: [
        (Story) => (
            <div className="bg-gray-100 p-10">
                <Story />
            </div>
        ),
    ],
} as Meta<typeof Dropdown>;

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
                <Dropdown.Item
                    className="label-medium px-4 py-0 mb-4 hover:bg-transparent focus:bg-transparent cursor-pointer"
                    key={item}
                >
                    {item}
                </Dropdown.Item>
            ))}
        </Dropdown.Group>
    </Dropdown>
);

export const Default = DropdownTemplate.bind({});
Default.args = {
    label: 'Categories',
};
