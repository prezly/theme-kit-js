import { ChevronDownIcon } from '@heroicons/react/24/solid';
import type { Meta, StoryFn } from '@storybook/react';

import { Badge } from './Badge';

const Icon = ChevronDownIcon;

export default {
    title: 'Buttons/Badge',
    component: Badge,
    decorators: [
        (Story) => (
            <div className="bg-gray-100 p-10">
                <Story />
            </div>
        ),
    ],
} as Meta<typeof Badge>;

const BadgeTemplateWithChild: StoryFn<typeof Badge> = (args) => <Badge {...args}>Badge</Badge>;

export const Primary = BadgeTemplateWithChild.bind({});
Primary.args = {
    variation: 'primary',
};

export const Secondary = BadgeTemplateWithChild.bind({});
Secondary.args = {
    ...Primary.args,
    variation: 'secondary',
};

export const PrimaryWithIconLeft = BadgeTemplateWithChild.bind({});
PrimaryWithIconLeft.args = {
    ...Primary.args,
    icon: Icon,
    iconPlacement: 'left',
};

export const PrimaryWithIconRight = BadgeTemplateWithChild.bind({});
PrimaryWithIconRight.args = {
    ...Primary.args,
    icon: Icon,
    iconPlacement: 'right',
};

export const SecondaryWithIconLeft = BadgeTemplateWithChild.bind({});
SecondaryWithIconLeft.args = {
    ...Secondary.args,
    icon: Icon,
    iconPlacement: 'left',
};

export const DisabledBadge = BadgeTemplateWithChild.bind({});
DisabledBadge.args = {
    ...Primary.args,
    icon: Icon,
    disabled: true,
};
