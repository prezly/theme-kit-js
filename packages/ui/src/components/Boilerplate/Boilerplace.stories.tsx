import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { COMPANY_INFORMATION } from './__mocks__';
import { Boilerplate } from './Boilerplate';

export default {
    title: 'Components/Boilerplate',
    component: Boilerplate,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/46dEAasj1iEtrVQOwmMswB/00--%3E-Themes-Design-System?type=design&node-id=1145-147377&mode=dev',
        },
        layout: 'fullscreen',
    },
} satisfies Meta<typeof Boilerplate>;

const BoilerplateTemplate: StoryFn<typeof Boilerplate> = (args) => <Boilerplate {...args} />;

export const Default: StoryObj<typeof Boilerplate> = BoilerplateTemplate.bind({});
Default.args = {
    companyInformation: COMPANY_INFORMATION,
};

export const WithoutAboutInformation: StoryObj<typeof Boilerplate> = BoilerplateTemplate.bind({});
WithoutAboutInformation.args = {
    companyInformation: { ...COMPANY_INFORMATION, about: '' },
};

export const WithoutContactSection: StoryObj<typeof Boilerplate> = BoilerplateTemplate.bind({});
WithoutContactSection.args = {
    companyInformation: {
        ...COMPANY_INFORMATION,
        phone: null,
        email: null,
        address: null,
        website: null,
    },
};
