/* eslint-disable @typescript-eslint/no-use-before-define */
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import type { FormEvent } from 'react';

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

const SubscriptionCtaTemplate: StoryFn<typeof SubscriptionCta> = ({
    onSubmit = preventDefault,
    ...args
}) => <SubscriptionCta onSubmit={onSubmit} {...args} />;

export const Default: StoryObj<typeof SubscriptionCta> = SubscriptionCtaTemplate.bind({});
Default.args = {};

export const WithError: StoryObj<typeof SubscriptionCta> = SubscriptionCtaTemplate.bind({});
WithError.args = {
    error: 'Invalid email',
};

function preventDefault(event: FormEvent) {
    event.preventDefault();
}
