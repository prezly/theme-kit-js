import type { Meta, StoryFn } from '@storybook/react';

import { SectionTitle } from './SectionTitle';

export default {
    title: 'Components/SectionTitle',
    component: SectionTitle,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/46dEAasj1iEtrVQOwmMswB/00--%3E-Themes-Design-System?type=design&node-id=660-16941&mode=dev',
        },
    },
} as Meta<typeof SectionTitle>;

const SectionTitleTemplate: StoryFn<typeof SectionTitle> = (args) => <SectionTitle {...args} />;

export const Default = SectionTitleTemplate.bind({});
Default.args = {
    title: 'Section Title',
    description: 'Section Description',
};
