import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { StoryShareLinks } from '.';

export default {
    title: 'Components/StoryShareLinks',
    component: StoryShareLinks,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/46dEAasj1iEtrVQOwmMswB/00--%3E-Themes-Design-System?type=design&node-id=705-23438&mode=dev',
        },
    },
} satisfies Meta<typeof StoryShareLinks>;

const StoryShareLinksTemplate: StoryFn<typeof StoryShareLinks> = (args) => (
    <StoryShareLinks {...args} />
);

export const Default: StoryObj<typeof StoryShareLinks> = StoryShareLinksTemplate.bind({});
Default.args = {
    shareUrl: 'https://story.test',
    withScrollToTopButton: true,
};
