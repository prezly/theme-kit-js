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
    rounded,
    ...buttonProps
}: Button.Props) {
    const iconClassName = twMerge(
        !children && variation !== 'navigation'
            ? // Adjusted icon height for square buttons
              'w-4 h-6'
            : 'w-6 h-6',
    );

    return (
        <button
            ref={forwardRef}
            type={type}
            className={twMerge(
                rounded ? 'rounded-full' : 'rounded',
                `flex items-center justify-center border border-transparent bg-transparent focus:ring-4 focus-within:ring-4 focus:ring-accent-lighter focus-within:ring-accent-lighter`,
                size === 'small' ? 'py-2 px-3 label-medium' : ' py-3 px-4 label-large',
                variation === 'primary' &&
                    `
                bg-accent border-accent text-accent-button-text
                hover:bg-accent-dark hover:border-accent-dark 
                focus:bg-accent-dark focus:border-transparent
                focus-within:bg-accent-dark focus-within:border-transparent
                active:bg-accent-dark active:border-accent-dark
                disabled:bg-accent-lighter disabled:border-transparent disabled:opacity-50
                `,
                variation === 'secondary' &&
                    `
                    bg-white border-gray-200 text-gray-800
                hover:border-gray-300 hover:bg-gray-50
                focus:bg-gray-50 focus:border-transparent 
                focus-within:bg-gray-50 focus-within:border-transparent
                active:bg-gray-100 active:border-gray-400
                disabled:bg-white disabled:border-transparent disabled:text-gray-400
                `,
                variation === 'navigation' &&
                    `
                p-0 bg-white text-gray-800 hover:text-gray-900
                focus:text-gray-950
                disabled:bg-white disabled:text-gray-400`,
                Boolean(Icon) && Boolean(children) && `gap-2`,
                className,
            )}
            disabled={disabled || isLoading}
            {...buttonProps}
        >
            {iconPlacement === 'left' && <Icon icon={icon} className={iconClassName} />}
            {/* If there are no children, we insert a zero-width space to preserve the line-height */}
            <span className={contentClassName}>{children ?? <>&#8203;</>}</span>
            {iconPlacement === 'right' && <Icon icon={icon} className={iconClassName} />}
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
