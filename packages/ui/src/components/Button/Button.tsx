import type { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

import { Icon } from './Icon';
import { type BaseProps, ButtonSize, ButtonVariant } from './types';

export function Button({
    variation = 'primary',
    className,
    forwardRef,
    type = 'button',
    size = 'default',
    icon,
    iconPlacement = 'left',
    isLoading,
    disabled,
    children,
    contentClassName,
    ...buttonProps
}: Button.Props) {
    return (
        <button
            ref={forwardRef}
            type={type}
            className={twMerge(
                'rounded flex items-center justify-center border border-transparent bg-transparent',
                size === 'small' ? `p-3 label-medium` : `p-4 label-large`,
                variation === 'primary' &&
                    `
                bg-accent border-accent text-accent-button-text
                hover:bg-accent-dark hover:border-accent-dark 
                focus:bg-accent-dark focus:border-transparent focus:ring-2 focus:ring-accent-lighter
                focus-within:bg-accent-dark focus-within:border-transparent focus-within:ring-2 focus-within:ring-accent-lighter
                active:bg-accent-dark active:border-accent-dark
                disabled:bg-accent-lighter disabled:border-transparent
                `,
                variation === 'secondary' &&
                    `
                    bg-white border-gray-200 text-gray-800
                hover:border-gray-300 hover:bg-gray-50
                focus:bg-gray-50 focus:border-transparent focus:ring-2 focus:ring-accent-lighter
                focus-within:bg-gray-50 focus-within:border-transparent focus-within:ring-2 focus-within:ring-accent-lighter
                active:bg-gray-100 active:border-gray-400
                disabled:bg-white disabled:border-transparent disabled:text-gray-400
                `,
                Boolean(Icon) && Boolean(children) && `gap-2`,
                className,
            )}
            disabled={disabled || isLoading}
            {...buttonProps}
        >
            {iconPlacement === 'left' && <Icon icon={icon} />}
            <span className={contentClassName}>{children}</span>
            {iconPlacement === 'right' && <Icon icon={icon} />}
        </button>
    );
}

export namespace Button {
    export type Props = BaseProps &
        ButtonHTMLAttributes<HTMLButtonElement> & {
            isLoading?: boolean;
            contentClassName?: string;
        };

    export type Variant = ButtonVariant;
    export const Variant = ButtonVariant;

    export type Size = ButtonSize;
    export const Size = ButtonSize;
}
