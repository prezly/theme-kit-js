import type { Meta, StoryFn } from '@storybook/react';

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
} as Meta<typeof ContactCard>;

const ContactCardTemplate: StoryFn<typeof ContactCard> = (args) => <ContactCard {...args} />;

export const Default = ContactCardTemplate.bind({});
Default.args = {
    contactInfo: CONTACT_INFO,
};
