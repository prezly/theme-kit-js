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
    const isIconOnly = Boolean(Icon) && !children;

    return (
        <button
            ref={forwardRef}
            type={type}
            className={twMerge(
                `${
                    rounded ? 'rounded-full' : 'rounded'
                } flex items-center justify-center border border-transparent bg-transparent`,
                size === 'small'
                    ? `${rounded ? 'py-2 px-3' : 'p-3'} label-medium`
                    : `${rounded ? 'py-3 px-4' : 'p-4'} label-large`,
                variation === 'primary' &&
                    `
                bg-accent border-accent text-accent-button-text
                hover:bg-accent-dark hover:border-accent-dark 
                focus:bg-accent-dark focus:border-transparent ${
                    rounded
                        ? 'focus:ring-4 focus-within:ring-4'
                        : 'focus:ring-2 focus-within:ring-2'
                }  focus:ring-accent-lighter
                focus-within:bg-accent-dark focus-within:border-transparent focus-within:ring-accent-lighter
                active:bg-accent-dark active:border-accent-dark
                disabled:bg-accent-lighter disabled:border-transparent disabled:opacity-50
                `,
                variation === 'secondary' &&
                    `
                    bg-white ${rounded ? 'border-transparent' : 'border-gray-200'} text-gray-800
                hover:border-gray-300 hover:bg-gray-50
                focus:bg-gray-50 focus:border-transparent ${
                    rounded
                        ? 'focus:ring-4 focus-within:ring-4'
                        : 'focus:ring-2 focus-within:ring-2'
                } focus:ring-accent-lighter
                focus-within:bg-gray-50 focus-within:border-transparent focus-within:ring-accent-lighter
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
            {iconPlacement === 'left' && (
                <Icon
                    icon={icon}
                    className={twMerge(isIconOnly && (size === 'small' ? `w-4 h-4` : `w-6 h-6`))}
                />
            )}
            {/* If there are no children, we insert a zero-width space to preserve the line-height */}
            <span className={contentClassName}>{children ?? <>&#8203;</>}</span>
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
