import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import type { Meta, StoryFn } from '@storybook/react';

import { Link } from './Link';

export default {
    title: 'Components/Link',
    component: Link,
} as Meta<typeof Link>;

const LinkTemplateWithChild: StoryFn<typeof Link> = (args) => (
    <Link {...args} href="https://prezly.com">
        Link
    </Link>
);

export const Primary = LinkTemplateWithChild.bind({});
Primary.args = {
    variation: 'primary',
};

export const Secondary = LinkTemplateWithChild.bind({});
Secondary.args = {
    ...Primary.args,
    variation: 'secondary',
};

export const PrimaryWithIconLeft = LinkTemplateWithChild.bind({});
PrimaryWithIconLeft.args = {
    ...Primary.args,
    icon: ArrowLeftIcon,
};

export const PrimaryWithIconRight = LinkTemplateWithChild.bind({});
PrimaryWithIconRight.args = {
    ...Primary.args,
    icon: ArrowRightIcon,
    iconPlacement: 'right',
};

export const SecondaryWithIconLeft = LinkTemplateWithChild.bind({});
SecondaryWithIconLeft.args = {
    ...Secondary.args,
    icon: ArrowLeftIcon,
    iconPlacement: 'left',
};

export const DisabledLink = LinkTemplateWithChild.bind({});
DisabledLink.args = {
    ...Primary.args,
    disabled: true,
};
