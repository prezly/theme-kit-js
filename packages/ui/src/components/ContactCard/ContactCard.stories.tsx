import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { CONTACT_INFO } from './__mocks__';
import { ContactCard } from './ContactCard';

export default {
    title: 'Components/ContactCard',
    component: ContactCard,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/46dEAasj1iEtrVQOwmMswB/00--%3E-Themes-Design-System?type=design&node-id=720-62555&mode=dev',
        },
    },
} satisfies Meta<typeof ContactCard>;

const ContactCardTemplate: StoryFn<typeof ContactCard> = (args) => <ContactCard {...args} />;

export const Default: StoryObj<typeof ContactCard> = ContactCardTemplate.bind({});
Default.args = {
    contact: CONTACT_INFO,
};

export const WithoutAvatar: StoryObj<typeof ContactCard> = ContactCardTemplate.bind({});
WithoutAvatar.args = {
    contact: { ...CONTACT_INFO, avatar_image: null },
};

export const WithoutSocials: StoryObj<typeof ContactCard> = ContactCardTemplate.bind({});
WithoutSocials.args = {
    contact: {
        ...CONTACT_INFO,
        email: null,
        phone: null,
        mobile: null,
        facebook: null,
        twitter: null,
    },
};

export const WithoutRole: StoryObj<typeof ContactCard> = ContactCardTemplate.bind({});
WithoutRole.args = {
    contact: {
        ...CONTACT_INFO,
        description: null,
    },
};
