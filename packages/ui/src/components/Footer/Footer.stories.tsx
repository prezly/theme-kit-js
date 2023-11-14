import { AnalyticsContextProvider } from '@prezly/analytics-nextjs';
import type { Meta, StoryFn } from '@storybook/react';

import { COMPANY_INFORMATION } from '../Boilerplate/__mocks__';

import { Footer } from './Footer';

export default {
    title: 'Components/Footer',
    component: Footer,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
        layout: 'fullscreen',
    },
    decorators: [
        (Story) => (
            <AnalyticsContextProvider>
                <Story />
            </AnalyticsContextProvider>
        ),
    ],
} as Meta<typeof Footer>;

const FooterTemplate: StoryFn<typeof Footer> = (args) => <Footer {...args} />;

export const Default = FooterTemplate.bind({});
Default.args = {
    companyInformation: COMPANY_INFORMATION,
    externalSiteLink: 'https://test-site',
    hasStandaloneAboutPage: true,
    hasStandaloneContactsPage: true,
    publicGalleriesCount: 1,
    newsroom: {
        uuid: '13b5794c-619e-4c6f-961c-0b8e15d771c9',
        custom_data_request_link: 'https://test.site',
        display_name: 'Test newsroom',
        is_white_labeled: false,
    },
    locale: 'en',
};

export const WithoutExternalLink = FooterTemplate.bind({});
WithoutExternalLink.args = {
    companyInformation: COMPANY_INFORMATION,
    hasStandaloneAboutPage: true,
    hasStandaloneContactsPage: true,
    publicGalleriesCount: 1,
    newsroom: {
        uuid: '13b5794c-619e-4c6f-961c-0b8e15d771c9',
        custom_data_request_link: 'https://test.site',
        display_name: 'Test newsroom',
        is_white_labeled: false,
    },
    locale: 'en',
};

export const WithoutMediaAndStandalonePages = FooterTemplate.bind({});
WithoutMediaAndStandalonePages.args = {
    companyInformation: COMPANY_INFORMATION,
    hasStandaloneAboutPage: false,
    hasStandaloneContactsPage: false,
    publicGalleriesCount: 0,
    newsroom: {
        uuid: '13b5794c-619e-4c6f-961c-0b8e15d771c9',
        custom_data_request_link: 'https://test.site',
        display_name: 'Test newsroom',
        is_white_labeled: false,
    },
    locale: 'en',
};

export const IsWhiteLabeled = FooterTemplate.bind({});
IsWhiteLabeled.args = {
    companyInformation: COMPANY_INFORMATION,
    hasStandaloneAboutPage: false,
    hasStandaloneContactsPage: false,
    publicGalleriesCount: 0,
    newsroom: {
        uuid: '13b5794c-619e-4c6f-961c-0b8e15d771c9',
        custom_data_request_link: 'https://test.site',
        display_name: 'Test newsroom',
        is_white_labeled: true,
    },
    locale: 'en',
};
