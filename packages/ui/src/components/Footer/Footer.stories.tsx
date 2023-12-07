import { AnalyticsContextProvider } from '@prezly/analytics-nextjs';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { COMPANY_INFORMATION } from '../Boilerplate/__mocks__';

import { Footer } from './Footer';

const meta: Meta<typeof Footer> = {
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
};
export default meta;

const FooterTemplate: StoryFn<typeof Footer> = (args) => <Footer {...args} />;

export const Default: StoryObj<typeof Footer> = FooterTemplate.bind({});
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

export const WithoutExternalLink: StoryObj<typeof Footer> = FooterTemplate.bind({});
WithoutExternalLink.args = {
    ...Default.args,
    externalSiteLink: undefined,
};

export const WithoutMediaAndStandalonePages: StoryObj<typeof Footer> = FooterTemplate.bind({});
WithoutMediaAndStandalonePages.args = {
    ...Default.args,
    hasStandaloneAboutPage: false,
    hasStandaloneContactsPage: false,
};

export const IsWhiteLabeled: StoryObj<typeof Footer> = FooterTemplate.bind({});
IsWhiteLabeled.args = {
    ...Default.args,
    isWhiteLabeled: false,
};
