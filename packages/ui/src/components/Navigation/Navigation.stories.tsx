/* eslint-disable @typescript-eslint/naming-convention */

import type { Meta, StoryFn } from '@storybook/react';

import { CATEGORIES, LANGUAGES, NEWSROOM } from './__mocks__';
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
    newsroom: NEWSROOM,
    externalSiteLink: 'https://hey.test-site.com/testing-1-2-3',
    onSearch: () => {},
    hasStandaloneAboutPage: true,
    hasStandaloneContactsPage: true,
    showNewsroomLabelAsideLogo: true,
    locale: 'en',
};

export const WithoutLogo = NavigationTemplate.bind({});
WithoutLogo.args = {
    ...Default.args,
    newsroom: {
        ...NEWSROOM,
        newsroom_logo: null,
    },
};

export const WithoutCategoriesAndLanguages = NavigationTemplate.bind({});
WithoutCategoriesAndLanguages.args = {
    ...Default.args,
    categories: [],
    languages: [],
};

export const WithoutExternalLink = NavigationTemplate.bind({});
WithoutExternalLink.args = {
    ...Default.args,
    categories: [],
    languages: [],
    externalSiteLink: undefined,
};
