import type { Meta, StoryFn } from '@storybook/react';

import { SocialMedia } from '.';

export default {
    title: 'Components/SocialMedia',
    component: SocialMedia,
} as Meta<typeof SocialMedia>;

const SocialMediaTemplate: StoryFn<typeof SocialMedia> = (args) => <SocialMedia {...args} />;

export const Default = SocialMediaTemplate.bind({});
Default.args = {
    companyInformation: {
        linkedin: 'https://linkedin.com/test',
        facebook: 'https://facebook.com/test',
        twitter: 'https://twitter.com/test',
    } as any,
};
