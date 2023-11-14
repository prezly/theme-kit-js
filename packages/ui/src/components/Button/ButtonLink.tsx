import NextLink, { type LinkProps } from 'next/link';
import type { HTMLProps, Ref, RefObject } from 'react';
import { twMerge } from 'tailwind-merge';

import { Icon } from './Icon';
import { type BaseProps, ButtonSize, ButtonVariant } from './types';

export function ButtonLink({
    variation = 'primary',
    className,
    forwardRef,
    forceRefresh,
    size = 'default',
    icon,
    iconPlacement = 'left',
    isLoading,
    disabled,
    children,
    contentClassName,
    localeCode,
    rounded,
    href,
    ...linkProps
}: ButtonLink.Props) {
    const Element = forceRefresh ? 'a' : NextLink;

    const hrefWithLocale = localeCode ? `/${localeCode}/${href.toString()}` : href.toString();

    const isIconOnly = Boolean(icon && !children);
    const hasLeftIcon = Boolean(icon && iconPlacement === 'left');
    const hasRightIcon = Boolean(icon && iconPlacement === 'right');

    return (
        <Element
            href={forceRefresh ? hrefWithLocale : href}
            ref={forwardRef as any}
            className={twMerge(
                rounded ? 'rounded-full' : 'rounded',
                `flex items-center justify-center border border-transparent bg-transparent focus:ring-4 focus-within:ring-4 focus:ring-accent-lighter focus-within:ring-accent-lighter leading-[126%]`,
                size === 'small'
                    ? `py-2 px-3 label-medium ${hasLeftIcon && 'pl-2'} ${hasRightIcon && 'pr-2'}`
                    : `py-3 px-4 label-large ${hasLeftIcon && 'pl-3'} ${hasRightIcon && 'pr-3'}`,
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
                isIconOnly && (size === 'small' ? 'p-2' : 'p-3'),
                className,
            )}
            {...linkProps}
        >
            {iconPlacement === 'left' && <Icon icon={icon} />}
            {/* If there are no children, we insert a zero-width space to preserve the line-height */}
            <span className={contentClassName}>{children ?? <>&#8203;</>}</span>
            {iconPlacement === 'right' && <Icon icon={icon} />}
        </Element>
    );
}

export namespace ButtonLink {
    export type Props = Omit<BaseProps, 'forwardRef'> &
        Omit<HTMLProps<HTMLAnchorElement>, 'size' | 'type'> & {
            isLoading?: boolean;
            contentClassName?: string;
            href: string;
            localeCode?: LinkProps['locale'];
            forceRefresh?: boolean;
            forwardRef?: Ref<HTMLAnchorElement> | RefObject<HTMLAnchorElement>;
        };

    export type Variant = ButtonVariant;
    export const Variant = ButtonVariant;

    export type Size = ButtonSize;
    export const Size = ButtonSize;
}
