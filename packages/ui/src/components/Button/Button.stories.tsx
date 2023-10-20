/* eslint-disable func-style */
import { PlusIcon } from '@heroicons/react/24/solid';
import type { Meta, StoryFn } from '@storybook/react';

import { Button } from '.';

const Icon = PlusIcon;

export default {
    title: 'Buttons/Button',
    component: Button,
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
PrimaryWithIconRight.args = {
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
