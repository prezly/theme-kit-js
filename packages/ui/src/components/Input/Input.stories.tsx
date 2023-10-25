/* eslint-disable func-style */
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
