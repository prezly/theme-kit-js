import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { Input } from '.';

const meta: Meta<typeof Input> = {
    title: 'Forms/Input',
    component: Input,
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
            url: 'https://www.figma.com/file/46dEAasj1iEtrVQOwmMswB/00--%3E-Themes-Design-System?type=design&node-id=633-23298&mode=dev',
        },
    },
};
export default meta;

const InputTemplate: StoryFn<typeof Input> = (args) => <Input {...args} />;

export const Default: StoryObj<typeof Input> = InputTemplate.bind({});
Default.args = {
    placeholder: 'Placeholder',
};

export const WithError: StoryObj<typeof Input> = InputTemplate.bind({});
WithError.args = {
    placeholder: 'Placeholder',
    error: 'Invalid input',
};
