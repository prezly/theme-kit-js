/* eslint-disable @typescript-eslint/naming-convention */

import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { CATEGORIES, LANGUAGES, NEWSROOM } from './__mocks__';
import { Navigation } from './Navigation';

const DISPLAYED_LANGUAGES: Navigation.DisplayedLanguage[] = LANGUAGES.map((lang) => ({
    code: lang.code,
    name: lang.locale.native_name,
    href: `/${lang.locale.code.toLowerCase().replace('_', '-')}`,
}));

const DISPLAYED_CATEGORIES: Navigation.DisplayedCategory[] = CATEGORIES.map((category) => ({
    id: category.id,
    name: category.display_name,
    description: category.display_description,
    href: `/category/${category.display_name.toLowerCase()}`,
}));

const DISPLAYED_NEWSROOM: Navigation.DisplayedNewsroom = {
    name: NEWSROOM.display_name,
    galleries: NEWSROOM.public_galleries_number,
    logo: NEWSROOM.newsroom_logo,
};

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
} satisfies Meta<typeof Navigation>;

const NavigationTemplate: StoryFn<typeof Navigation> = (args) => <Navigation {...args} />;

export const Default: StoryObj<typeof Navigation> = NavigationTemplate.bind({});
Default.args = {
    categories: { options: DISPLAYED_CATEGORIES, indexHref: '/categories' },
    languages: DISPLAYED_LANGUAGES,
    newsroom: DISPLAYED_NEWSROOM,
    externalSiteLink: 'https://hey.test-site.com/testing-1-2-3',
    onSearch: () => {},
    hasStandaloneAboutPage: true,
    hasStandaloneContactsPage: true,
    showNewsroomLabelAsideLogo: true,
    locale: 'en',
    indexHref: '/',
    aboutHref: '/about',
    contactsHref: '/contacts',
    mediaHref: '/media',
};

export const WithoutLogo: StoryObj<typeof Navigation> = NavigationTemplate.bind({});
WithoutLogo.args = {
    ...Default.args,
    newsroom: {
        ...DISPLAYED_NEWSROOM,
        logo: null,
    },
};

export const WithoutCategoriesAndLanguages: StoryObj<typeof Navigation> = NavigationTemplate.bind(
    {},
);
WithoutCategoriesAndLanguages.args = {
    ...Default.args,
    categories: undefined,
    languages: undefined,
};

export const WithoutExternalLink: StoryObj<typeof Navigation> = NavigationTemplate.bind({});
WithoutExternalLink.args = {
    ...Default.args,
    categories: undefined,
    languages: undefined,
    externalSiteLink: undefined,
};
