import type { ButtonHTMLAttributes, Ref } from 'react';

import { defaultTheme } from './defaultTheme';
import { Icon } from './Icon';
import type { Theme as GenericTheme } from './theming';
import { type BaseProps, ButtonSize, ButtonVariant } from './types';

export function Button(props: Button.Props) {
    const {
        type = 'button',
        variation = 'primary',
        size = 'default',
        iconPlacement = 'left',
        theme = defaultTheme,
        icon,
        className,
        forwardRef,
        disabled,
        children,
        rounded,
        ...attributes
    } = props;

    const compiledProps = { ...props, variation, type, size, iconPlacement };

    return (
        <button
            ref={forwardRef}
            type={type}
            className={theme.button(compiledProps, className)}
            disabled={disabled}
            {...attributes}
        >
            {iconPlacement === 'left' && <Icon icon={icon} className={theme.icon(compiledProps)} />}

            <span className={theme.content(compiledProps)}>{children}</span>

            {iconPlacement === 'right' && (
                <Icon icon={icon} className={theme.icon(compiledProps)} />
            )}
        </button>
    );
}

export namespace Button {
    export type Props = BaseProps &
        ButtonHTMLAttributes<HTMLButtonElement> & {
            theme?: Theme;
            forwardRef?: Ref<HTMLButtonElement>;
        };

    export type Variant = ButtonVariant;
    export const Variant = ButtonVariant;

    export type Size = ButtonSize;
    export const Size = ButtonSize;

    export type Theme = GenericTheme<
        'button' | 'icon' | 'content',
        Omit<Props, 'theme' | 'forwardRef'>
    >;
    export const theme: Theme = defaultTheme;
}
