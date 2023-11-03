import { PlusIcon } from '@heroicons/react/24/solid';
import type { Meta, StoryFn } from '@storybook/react';

import { Button } from '.';

const Icon = PlusIcon;

export default {
    title: 'Buttons/Button',
    component: Button,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/46dEAasj1iEtrVQOwmMswB/00--%3E-Themes-Design-System?type=design&node-id=599-24589&mode=dev',
        },
    },
} as Meta<typeof Button>;

const ButtonTemplateWithChild: StoryFn<typeof Button> = (args) => <Button {...args}>Button</Button>;
const ButtonTemplateWithoutChild: StoryFn<typeof Button> = (args) => <Button {...args} />;

export const Primary = ButtonTemplateWithChild.bind({});
Primary.args = {
    type: 'button',
    variation: 'primary',
};

export const Secondary = ButtonTemplateWithChild.bind({});
Secondary.args = {
    ...Primary.args,
    variation: 'secondary',
};

export const PrimaryWithIconLeft = ButtonTemplateWithChild.bind({});
PrimaryWithIconLeft.args = {
    ...Primary.args,
    icon: Icon,
};

export const PrimaryWithIconRight = ButtonTemplateWithChild.bind({});
PrimaryWithIconRight.args = {
    ...Primary.args,
    icon: Icon,
    iconPlacement: 'right',
};

export const SecondaryWithIconLeft = ButtonTemplateWithChild.bind({});
SecondaryWithIconLeft.args = {
    ...Secondary.args,
    icon: Icon,
    iconPlacement: 'left',
};

export const SquareButton = ButtonTemplateWithoutChild.bind({});
SquareButton.args = {
    ...Primary.args,
    icon: Icon,
};

export const DisabledButton = ButtonTemplateWithChild.bind({});
DisabledButton.args = {
    ...Primary.args,
    icon: Icon,
    disabled: true,
};

export const LoadingButton = ButtonTemplateWithChild.bind({});
LoadingButton.args = {
    ...Primary.args,
    icon: Icon,
    isLoading: true,
};

export const Badge = ButtonTemplateWithChild.bind({});
Badge.args = {
    icon: Icon,
    rounded: true,
    iconPlacement: 'right',
};

export const SecondaryBadge = ButtonTemplateWithChild.bind({});
SecondaryBadge.decorators = [
    (Story) => (
        <div className="bg-gray-100 p-10">
            <Story />
        </div>
    ),
];
SecondaryBadge.args = {
    icon: Icon,
    rounded: true,
    variation: 'secondary',
    iconPlacement: 'right',
};

export const SmallBadge = ButtonTemplateWithChild.bind({});
SmallBadge.args = {
    icon: Icon,
    rounded: true,
    size: 'small',
    iconPlacement: 'right',
};
