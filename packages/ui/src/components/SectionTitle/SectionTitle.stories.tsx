import type { Meta, StoryFn, StoryObj } from '@storybook/react';

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
} satisfies Meta<typeof SectionTitle>;

const SectionTitleTemplate: StoryFn<typeof SectionTitle> = (args) => <SectionTitle {...args} />;

export const Default: StoryObj<typeof SectionTitle> = SectionTitleTemplate.bind({});
Default.args = {
    title: 'Section Title',
    description: 'Section Description',
};
