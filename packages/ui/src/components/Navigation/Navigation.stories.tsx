/* eslint-disable @typescript-eslint/naming-convention */

import type { Meta, StoryFn } from '@storybook/react';

import { CATEGORIES, LANGUAGES } from './__mocks__';
import { Navigation } from './Navigation';

export default {
    title: 'Components/Navigation',
    component: Navigation,
    parameters: { layout: 'fullscreen' },
} as Meta<typeof Navigation>;

const NavigationTemplate: StoryFn<typeof Navigation> = (args) => <Navigation {...args} />;

export const Default = NavigationTemplate.bind({});
Default.args = {
    categories: CATEGORIES,
    languages: LANGUAGES,
    publicGalleriesCount: 1,
    siteName: 'Test site',
    externalSiteLink: 'https://hey.test-site.com/testing-1-2-3',
    layout: 'centered',
    logo: {
        version: 2,
        uuid: '13b5794c-619e-4c6f-961c-0b8e15d771c9',
        filename: 'goodnewsroom-new.png',
        mime_type: 'image/png',
        size: 21659,
        original_width: 916,
        original_height: 331,
        effects: [],
    },
    onSearch: () => {},
    hasStandaloneAboutPage: true,
    hasStandaloneContactsPage: true,
    locale: 'en',
};
