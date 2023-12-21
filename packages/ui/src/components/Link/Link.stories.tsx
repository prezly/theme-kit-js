import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { Link } from './Link';

export default {
    title: 'Components/Link',
    component: Link,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/46dEAasj1iEtrVQOwmMswB/00--%3E-Themes-Design-System?type=design&node-id=1128-37111&mode=dev',
        },
    },
} satisfies Meta<typeof Link>;

const LinkTemplateWithChild: StoryFn<typeof Link> = (args) => (
    <Link {...args} href="https://prezly.com">
        Link
    </Link>
);

export const Primary: StoryObj<typeof Link> = LinkTemplateWithChild.bind({});
Primary.args = {
    variation: 'primary',
};

export const Secondary: StoryObj<typeof Link> = LinkTemplateWithChild.bind({});
Secondary.args = {
    ...Primary.args,
    variation: 'secondary',
};

export const PrimaryWithIconLeft: StoryObj<typeof Link> = LinkTemplateWithChild.bind({});
PrimaryWithIconLeft.args = {
    ...Primary.args,
    icon: ArrowLeftIcon,
};

export const PrimaryWithIconRight: StoryObj<typeof Link> = LinkTemplateWithChild.bind({});
PrimaryWithIconRight.args = {
    ...Primary.args,
    icon: ArrowRightIcon,
    iconPlacement: 'right',
};

export const SecondaryWithIconLeft: StoryObj<typeof Link> = LinkTemplateWithChild.bind({});
SecondaryWithIconLeft.args = {
    ...Secondary.args,
    icon: ArrowLeftIcon,
    iconPlacement: 'left',
};

export const DisabledLink: StoryObj<typeof Link> = LinkTemplateWithChild.bind({});
DisabledLink.args = {
    ...Primary.args,
    disabled: true,
};
