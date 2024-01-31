import { PlusIcon } from '@heroicons/react/24/solid';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { extendTheme } from '../../styler';

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
} satisfies Meta<typeof Button>;

const ButtonTemplateWithChild: StoryFn<typeof Button> = (args) => <Button {...args}>Button</Button>;
const ButtonTemplateWithoutChild: StoryFn<typeof Button> = (args) => <Button {...args} />;

export const Primary: StoryObj<typeof Button> = ButtonTemplateWithChild.bind({});
Primary.args = {
    type: 'button',
    variation: 'primary',
};

export const Secondary: StoryObj<typeof Button> = ButtonTemplateWithChild.bind({});
Secondary.args = {
    ...Primary.args,
    variation: 'secondary',
};

export const PrimaryWithIconLeft: StoryObj<typeof Button> = ButtonTemplateWithChild.bind({});
PrimaryWithIconLeft.args = {
    ...Primary.args,
    icon: Icon,
};

export const PrimaryWithIconRight: StoryObj<typeof Button> = ButtonTemplateWithChild.bind({});
PrimaryWithIconRight.args = {
    ...Primary.args,
    icon: Icon,
    iconPlacement: 'right',
};

export const SecondaryWithIconLeft: StoryObj<typeof Button> = ButtonTemplateWithChild.bind({});
SecondaryWithIconLeft.args = {
    ...Secondary.args,
    icon: Icon,
    iconPlacement: 'left',
};

export const SquareButton: StoryObj<typeof Button> = ButtonTemplateWithoutChild.bind({});
SquareButton.args = {
    ...Primary.args,
    icon: Icon,
};

export const DisabledButton: StoryObj<typeof Button> = ButtonTemplateWithChild.bind({});
DisabledButton.args = {
    ...Primary.args,
    icon: Icon,
    disabled: true,
};

export const Rounded: StoryObj<typeof Button> = ButtonTemplateWithChild.bind({});
Rounded.parameters = {
    design: {
        type: 'figma',
        url: 'https://www.figma.com/file/46dEAasj1iEtrVQOwmMswB/00--%3E-Themes-Design-System?type=design&node-id=1128-39276&mode=dev',
    },
};
Rounded.args = {
    icon: Icon,
    rounded: true,
    iconPlacement: 'right',
};

export const SecondaryRounded: StoryObj<typeof Button> = ButtonTemplateWithChild.bind({});
SecondaryRounded.parameters = Rounded.parameters;
SecondaryRounded.args = {
    icon: Icon,
    rounded: true,
    variation: 'secondary',
    iconPlacement: 'right',
};

export const SmallRounded: StoryObj<typeof Button> = ButtonTemplateWithChild.bind({});
SmallRounded.parameters = Rounded.parameters;
SmallRounded.args = {
    icon: Icon,
    rounded: true,
    size: 'small',
    iconPlacement: 'right',
};

export const Themed: StoryObj<typeof Button> = ButtonTemplateWithChild.bind({});
Themed.args = {
    type: 'button',
    variation: 'primary',
    theme: extendTheme(Button.theme, {
        content: 'title-x-large text-gray-50',
    }),
};
