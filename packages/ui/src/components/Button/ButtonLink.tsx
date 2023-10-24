import NextLink, { type LinkProps } from 'next/link';
import type { HTMLProps, Ref } from 'react';
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
    href,
    ...linkProps
}: ButtonLink.Props) {
    const isIconOnly = Boolean(Icon) && !children;

    function renderAnchorTag(linkHref?: string) {
        return (
            <a
                href={linkHref}
                ref={forwardRef}
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
                    isIconOnly && (size === 'small' ? `px-[0.84rem] py-3` : `px-[1.125rem] py-4`),
                    className,
                )}
                {...linkProps}
            >
                {iconPlacement === 'left' && <Icon icon={icon} />}
                {/* If there are no children, we insert a zero-width space to preserve the line-height */}
                <span className={contentClassName}>{children ?? <>&#8203;</>}</span>
                {iconPlacement === 'right' && <Icon icon={icon} />}
            </a>
        );
    }

    if (forceRefresh) {
        const hrefWithLocale = localeCode ? `/${localeCode}${href.toString()}` : href.toString();

        return renderAnchorTag(hrefWithLocale);
    }

    return (
        <NextLink href={href} locale={localeCode} passHref legacyBehavior>
            {renderAnchorTag()}
        </NextLink>
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
            forwardRef?: Ref<HTMLAnchorElement>;
        };

    export type Variant = ButtonVariant;
    export const Variant = ButtonVariant;

    export type Size = ButtonSize;
    export const Size = ButtonSize;
}