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
    companySocials: COMPANY_INFORMATION,
    hasStandaloneAboutPage: true,
    hasStandaloneContactsPage: true,
    publicGalleriesCount: 1,
    newsroomName: 'Test newsroom',
    isWhiteLabeled: false,
    privacyRequestLink: 'https://test.com',
    externalSiteLink: 'https://test.com',
};

export const WithoutExternalLink = FooterTemplate.bind({});
WithoutExternalLink.args = {
    ...Default.args,
    externalSiteLink: undefined,
};

export const WithoutMediaAndStandalonePages = FooterTemplate.bind({});
WithoutMediaAndStandalonePages.args = {
    ...Default.args,
    hasStandaloneAboutPage: false,
    hasStandaloneContactsPage: false,
};

export const IsWhiteLabeled = FooterTemplate.bind({});
IsWhiteLabeled.args = {
    ...Default.args,
    isWhiteLabeled: false,
};
