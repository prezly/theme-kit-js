import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { Icon } from './Icon';
import type { BaseProps } from './types';

export interface ButtonProps extends BaseProps, ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    isDisabled?: boolean;
    onClick?: () => void;
    contentClassName?: string;
}

export const Button = forwardRef<
    HTMLButtonElement,
    Omit<PropsWithChildren<ButtonProps>, 'onResize' | 'onResizeCapture'>
>(
    (
        {
            variation = 'primary',
            className,
            type = 'button',
            size = 'default',
            icon,
            iconPlacement = 'left',
            isLoading,
            isDisabled,
            onClick,
            children,
            contentClassName,
            ...buttonProps
        },
        ref,
    ) => (
        <button
            ref={ref}
            // eslint-disable-next-line react/button-has-type
            type={type}
            className={twMerge(
                'rounded-[4px] flex items-center justify-center border-[1px] border-transparent bg-transparent',
                className,
                size === 'small' ? `p-3 label-medium` : `p-4 label-large`,
                variation === 'primary' &&
                    `
                bg-[color:var(--prezly-accent-color)] border-[color:var(--prezly-accent-color)] text-[color:var(--prezly-accent-color-button-text)]
                hover:bg-[color:var(--prezly-accent-color-dark)] hover:border-[color:var(--prezly-accent-color-dark)] 
                focus:bg-[color:var(--prezly-accent-color-dark)] focus:border-2 focus:border-[color:var(--prezly-accent-color-lighter)]
                focus-within:bg-[color:var(--prezly-accent-color-dark)] focus-within:border-2 focus-within:border-[color:var(--prezly-accent-color-lighter)]
                active:bg-[color:var(--prezly-accent-color-darker)] active:border-[color:var(--prezly-accent-color-darker)]
                disabled:bg-[color:var(--prezly-accent-color-lighter)] disabled:border-transparent
                `,
                variation === 'secondary' &&
                    `
                    bg-white border-gray-200 text-gray-800
                hover:border-gray-300 hover:bg-gray-50
                focus:bg-gray-50 focus:border-2 focus:border-[color:var(--prezly-accent-color-lighter)]
                focus-within:bg-gray-50 focus-within:border-2 focus-within:border-[color:var(--prezly-accent-color-lighter)]
                active:bg-gray-100 active:border-gray-400
                disabled:bg-white disabled:border-transparent disabled:text-gray-400
                `,
                Boolean(icon) && !children && `ml-0 mr-0`,
            )}
            onClick={onClick}
            disabled={isDisabled || isLoading}
            {...buttonProps}
        >
            {iconPlacement === 'left' && <Icon icon={icon} iconOnly={!children} placement="left" />}
            {/* If there are no children, we insert a zero-width space to preserve the line-height */}
            <span className={contentClassName}>{children ?? <>&#8203;</>}</span>
            {iconPlacement === 'right' && (
                <Icon icon={icon} iconOnly={!children} placement="right" />
            )}
        </button>
    ),
);

Button.displayName = 'Button';
