import NextLink, { type LinkProps } from 'next/link';
import type { HTMLProps, Ref, RefObject } from 'react';
import { twMerge } from 'tailwind-merge';

import { Icon } from './Icon';
import { type BaseProps, LinkSize, LinkVariant } from './types';

export function Link({
    variation = 'primary',
    className,
    forwardRef,
    forceRefresh,
    size = 'default',
    icon,
    iconPlacement = 'left',
    disabled,
    isLoading,
    children,
    contentClassName,
    localeCode,
    href,
    ...linkProps
}: Link.Props) {
    const Element = forceRefresh ? 'a' : NextLink;

    const isIconOnly = Boolean(Icon) && !children;
    const hrefWithLocale = localeCode ? `/${localeCode}/${href.toString()}` : href.toString();

    return (
        <Element
            href={forceRefresh ? hrefWithLocale : href}
            ref={forwardRef as any}
            className={twMerge(
                'flex items-center justify-center w-max rounded',
                size === 'small' ? `label-medium` : `label-large`,
                variation === 'primary' &&
                    `
  text-accent hover:text-accent-dark active:text-accent-dark focus:text-accent-dark focus-within:text-accent-dark
  focus:ring-2 focus:ring-accent-lighter focus-within:ring-2 focus-within:ring-accent-lighter
  ${disabled && `text-accent-lighter pointer-events-none`}
  `,
                variation === 'secondary' &&
                    `
      text-gray-600 hover:text-gray-800 focus:text-gray-800 focus:ring-2 focus:ring-accent-lighter
  focus-within:text-gray-800 focus-within:ring-2 focus-within:ring-accent-lighter active:text-gray-950 ${
      disabled && `text-gray-500 pointer-events-none`
  }
  `,
                Boolean(Icon) && Boolean(children) && `gap-2`,
                isIconOnly && (size === 'small' ? `px-[0.84rem] py-3` : `px-[1.125rem] py-4`),
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

export namespace Link {
    export type Props = Omit<BaseProps, 'forwardRef'> &
        Omit<HTMLProps<HTMLAnchorElement>, 'size' | 'type'> & {
            isLoading?: boolean;
            contentClassName?: string;
            href: string;
            localeCode?: LinkProps['locale'];
            forceRefresh?: boolean;
            forwardRef?: Ref<HTMLAnchorElement> | RefObject<HTMLAnchorElement>;
        };

    export type Variant = LinkVariant;
    export const Variant = LinkVariant;

    export type Size = LinkSize;
    export const Size = LinkSize;
}
