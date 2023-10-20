/* eslint-disable func-style */
/* eslint-disable @typescript-eslint/naming-convention */
import { PlusIcon } from '@heroicons/react/24/solid';
import type { Meta, StoryFn } from '@storybook/react';

import { ButtonSize, ButtonVariants } from './types';

import { Button, type ButtonProps } from '.';

const Icon = PlusIcon;

export default {
    title: 'Buttons/Button',
    component: Button,
} as Meta<typeof Button>;

export const AllVariations: StoryFn<typeof Button> = (args) => {
    const sets: Record<string, ButtonProps> = {
        Regular: { children: 'Button' },
        Disabled: { children: 'Button', disabled: true },
        'Left Icon': { icon: Icon, children: 'Button' },
        'Left Icon (disabled)': { icon: Icon, children: 'Button', disabled: true },
        'Left Icon (loading)': { icon: Icon, children: 'Button', isLoading: true },
        'Right Icon': { icon: Icon, iconPlacement: 'right', children: 'Button' },
        'Icon Only': { icon: Icon },
        'Icon Only (disabled)': {
            icon: Icon,
            disabled: true,
        },
        'Icon Only (loading)': {
            icon: Icon,
            isLoading: true,
        },
    };
    const variants = Object.values(ButtonVariants);
    const sizes = Object.values(ButtonSize);

    return (
        <>
            {Object.entries(sets).map(([name, props]) => (
                <div className="sb-unstyled" key={name}>
                    <h2>{name}</h2>
                    <table style={{ borderSpacing: 32, borderCollapse: 'initial' }}>
                        <thead>
                            <tr>
                                <th />
                                {variants.map((variant) => (
                                    <th key={variant}>{variant}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sizes.map((size) => (
                                <tr key={size}>
                                    <th>{size}</th>
                                    {variants.map((variant) => (
                                        <td key={variant}>
                                            <Button
                                                {...args}
                                                {...props}
                                                size={size}
                                                variation={variant}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </>
    );
};

AllVariations.parameters = {
    design: {
        type: 'figma',
        url: 'https://www.figma.com/file/46dEAasj1iEtrVQOwmMswB/00--%3E-Themes-Design-System?type=design&node-id=601-3728&mode=dev',
    },
};

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

export const SquareButton = ButtonTemplateWithoutChild.bind({});
SquareButton.args = {
    ...Primary.args,
    icon: Icon,
};
