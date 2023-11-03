/* eslint-disable @typescript-eslint/naming-convention */

import type { Meta, StoryFn } from '@storybook/react';

import { CATEGORIES, LANGUAGES } from './__mocks__';
import { Navigation } from './Navigation';

export default {
    title: 'Components/Navigation',
    component: Navigation,
    parameters: {
        layout: 'fullscreen',
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/46dEAasj1iEtrVQOwmMswB/00--%3E-Themes-Design-System?type=design&node-id=649-3016&mode=dev',
        },
    },
} as Meta<typeof Navigation>;

const NavigationTemplate: StoryFn<typeof Navigation> = (args) => <Navigation {...args} />;

export const Default = NavigationTemplate.bind({});
Default.args = {
    categories: CATEGORIES,
    languages: LANGUAGES,
    newsroom: {
        display_name: 'Test site',
        public_galleries_number: 1,
        newsroom_logo: {
            version: 2,
            uuid: '13b5794c-619e-4c6f-961c-0b8e15d771c9',
            filename: 'goodnewsroom-new.png',
            mime_type: 'image/png',
            size: 21659,
            original_width: 916,
            original_height: 331,
            effects: [],
        },
    },
    externalSiteLink: 'https://hey.test-site.com/testing-1-2-3',
    layout: 'default',
    onSearch: () => {},
    hasStandaloneAboutPage: true,
    hasStandaloneContactsPage: true,
    locale: 'en',
};

export const Centered = NavigationTemplate.bind({});
Centered.args = {
    categories: CATEGORIES,
    languages: LANGUAGES,
    newsroom: {
        display_name: 'Test site',
        public_galleries_number: 1,
        newsroom_logo: {
            version: 2,
            uuid: '13b5794c-619e-4c6f-961c-0b8e15d771c9',
            filename: 'goodnewsroom-new.png',
            mime_type: 'image/png',
            size: 21659,
            original_width: 916,
            original_height: 331,
            effects: [],
        },
    },
    externalSiteLink: 'https://hey.test-site.com/testing-1-2-3',
    layout: 'centered',
    onSearch: () => {},
    hasStandaloneAboutPage: true,
    hasStandaloneContactsPage: true,
    locale: 'en',
};

export const WithoutLogo = NavigationTemplate.bind({});
WithoutLogo.args = {
    categories: CATEGORIES,
    languages: LANGUAGES,
    newsroom: {
        display_name: 'Testing site',
        public_galleries_number: 1,
        newsroom_logo: null,
    },
    externalSiteLink: 'https://hey.test-site.com/testing-1-2-3',
    layout: 'centered',
    onSearch: () => {},
    hasStandaloneAboutPage: true,
    hasStandaloneContactsPage: true,
    locale: 'en',
};

export const WithoutCategoriesAndLanguages = NavigationTemplate.bind({});
WithoutCategoriesAndLanguages.args = {
    categories: [],
    languages: [],
    newsroom: {
        display_name: 'Testing site',
        public_galleries_number: 0,
        newsroom_logo: {
            version: 2,
            uuid: '13b5794c-619e-4c6f-961c-0b8e15d771c9',
            filename: 'goodnewsroom-new.png',
            mime_type: 'image/png',
            size: 21659,
            original_width: 916,
            original_height: 331,
            effects: [],
        },
    },
    externalSiteLink: 'https://hey.test-site.com/testing-1-2-3',
    onSearch: () => {},
    locale: 'en',
};

export const WithoutExternalLink = NavigationTemplate.bind({});
WithoutExternalLink.args = {
    categories: [],
    languages: [],
    newsroom: {
        display_name: 'Testing site',
        public_galleries_number: 0,
        newsroom_logo: {
            version: 2,
            uuid: '13b5794c-619e-4c6f-961c-0b8e15d771c9',
            filename: 'goodnewsroom-new.png',
            mime_type: 'image/png',
            size: 21659,
            original_width: 916,
            original_height: 331,
            effects: [],
        },
    },
    onSearch: () => {},
    locale: 'en',
};
