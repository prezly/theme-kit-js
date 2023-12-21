import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { SubscriptionCta } from './SubscriptionCta';

export default {
    title: 'Components/SubscriptionCta',
    component: SubscriptionCta,
    parameters: {
        layout: 'fullscreen',
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/46dEAasj1iEtrVQOwmMswB/00--%3E-Themes-Design-System?type=design&node-id=649-3020&mode=dev',
        },
    },
} satisfies Meta<typeof SubscriptionCta>;

const SubscriptionCtaTemplate: StoryFn<typeof SubscriptionCta> = (args) => (
    <SubscriptionCta {...args} />
);

export const Default: StoryObj<typeof SubscriptionCta> = SubscriptionCtaTemplate.bind({});
Default.args = {};

export const WithError: StoryObj<typeof SubscriptionCta> = SubscriptionCtaTemplate.bind({});
WithError.args = {
    error: 'Invalid email',
};
