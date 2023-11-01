import type { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

import { Icon } from './Icon';
import { BadgeSize, BadgeVariant, type BaseProps } from './types';

export function Badge({
    variation = 'primary',
    className,
    forwardRef,
    type = 'button',
    size = 'default',
    icon,
    iconPlacement = 'right',
    children,
    contentClassName,
    ...buttonProps
}: Badge.Props) {
    return (
        <button
            ref={forwardRef}
            type={type}
            className={twMerge(
                'rounded-full flex items-center justify-center border border-transparent bg-transparent gap-2',
                size === 'small' ? `py-2 px-3 label-medium` : `py-3 px-4 label-large`,
                variation === 'primary' &&
                    `
                bg-accent border-accent text-accent-button-text
                hover:bg-accent-dark hover:border-accent-dark 
                focus:bg-accent-dark focus:border-transparent focus:ring-4 focus:ring-accent-lighter
                focus-within:bg-accent-dark focus-within:border-transparent focus-within:ring-4 focus-within:ring-accent-lighter
                active:bg-accent-dark active:border-accent-dark
                disabled:bg-accent-lighter disabled:border-transparent disabled:opacity-50
                `,
                variation === 'secondary' &&
                    `
                    bg-white text-gray-800
                hover:border-gray-300 hover:bg-gray-50
                focus:bg-gray-50 focus:border-transparent focus:ring-4 focus:ring-accent-lighter
                focus-within:bg-gray-50 focus-within:border-transparent focus-within:ring-4 focus-within:ring-accent-lighter
                active:bg-gray-100 active:border-gray-400
                disabled:bg-white disabled:border-transparent disabled:text-gray-400
                `,
                className,
            )}
            {...buttonProps}
        >
            {iconPlacement === 'left' && <Icon icon={icon} />}
            {/* If there are no children, we insert a zero-width space to preserve the line-height */}
            <span className={contentClassName}>{children ?? <>&#8203;</>}</span>
            {iconPlacement === 'right' && <Icon icon={icon} />}
        </button>
    );
}

export namespace Badge {
    export type Props = BaseProps &
        ButtonHTMLAttributes<HTMLButtonElement> & {
            contentClassName?: string;
        };

    export type Variant = BadgeVariant;
    export const Variant = BadgeVariant;

    export type Size = BadgeSize;
    export const Size = BadgeSize;
}
