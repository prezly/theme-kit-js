import { AnalyticsProvider } from '@prezly/analytics-nextjs';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { STORY } from './__mocks__';
import { ContentRenderer } from './ContentRenderer';

const meta: Meta<typeof ContentRenderer> = {
    title: 'Components/ContentRenderer',
    component: ContentRenderer,
    parameters: {
        layout: 'fullscreen',
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/46dEAasj1iEtrVQOwmMswB/00--%3E-Themes-Design-System?type=design&node-id=649-3016&mode=dev',
        },
    },
    decorators: [
        (Story) => (
            <p className="max-w-3xl p-10 mx-auto">
                <AnalyticsProvider>
                    <Story />
                </AnalyticsProvider>
            </p>
        ),
    ],
};
export default meta;

const ContentRendererTemplate: StoryFn<typeof ContentRenderer> = (args) => (
    <ContentRenderer {...args} />
);

export const Default: StoryObj<typeof ContentRenderer> = ContentRendererTemplate.bind({});
Default.args = {
    story: STORY,
    nodes: JSON.parse(STORY.content),
};
