import type { Meta, StoryFn } from '@storybook/react';

import { Input } from '.';

export default {
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
} as Meta<typeof Input>;

const InputTemplate: StoryFn<typeof Input> = (args) => <Input {...args} />;

export const Default = InputTemplate.bind({});
Default.args = {
    placeholder: 'Placeholder',
};

export const WithError = InputTemplate.bind({});
WithError.args = {
    placeholder: 'Placeholder',
    error: 'Invalid input',
};
