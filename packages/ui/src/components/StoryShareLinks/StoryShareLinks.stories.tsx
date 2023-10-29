import type { Meta, StoryFn } from '@storybook/react';

import { StoryShareLinks } from '.';

export default {
    title: 'Components/StoryShareLinks',
    component: StoryShareLinks,
} as Meta<typeof StoryShareLinks>;

const StoryShareLinksTemplate: StoryFn<typeof StoryShareLinks> = (args) => (
    <StoryShareLinks {...args} />
);

export const Default = StoryShareLinksTemplate.bind({});
Default.args = {
    shareUrl: 'https://story.test',
    showScrollToTopButton: true,
};
