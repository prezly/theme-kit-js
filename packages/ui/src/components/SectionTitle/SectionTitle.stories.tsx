import type { Meta, StoryFn } from '@storybook/react';

import { SectionTitle } from '.';

export default {
    title: 'Components/SectionTitle',
    component: SectionTitle,
} as Meta<typeof SectionTitle>;

const SectionTitleTemplate: StoryFn<typeof SectionTitle> = (args) => <SectionTitle {...args} />;

export const Default = SectionTitleTemplate.bind({});
Default.args = {
    title: 'Section Title',
    description: 'Section Description',
};
