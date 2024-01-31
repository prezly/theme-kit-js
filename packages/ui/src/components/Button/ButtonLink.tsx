import NextLink, { type LinkProps } from 'next/link';
import type { HTMLProps, Ref, RefObject } from 'react';

import type { Theme as GenericTheme } from '../../styler';

import { defaultTheme } from './defaultTheme';
import { Icon } from './Icon';
import { type BaseProps, ButtonSize, ButtonVariant } from './types';

export function ButtonLink(props: ButtonLink.Props) {
    const {
        variation = 'primary',
        size = 'default',
        iconPlacement = 'left',
        className,
        forwardRef,
        forceRefresh,
        icon,
        theme = defaultTheme,
        disabled,
        children,
        localeCode,
        rounded,
        href,
        ...attributes
    } = props;

    const Element = forceRefresh ? 'a' : NextLink;

    const hrefWithLocale = localeCode ? `/${localeCode}/${href.toString()}` : href.toString();

    const compiledProps = { ...props, variation, size, iconPlacement };

    return (
        <Element
            href={forceRefresh ? hrefWithLocale : href}
            ref={forwardRef as any}
            className={theme.button(compiledProps, className)}
            {...attributes}
        >
            {iconPlacement === 'left' && <Icon icon={icon} className={theme.icon(compiledProps)} />}

            <span className={theme.content(compiledProps)}>{children}</span>

            {iconPlacement === 'right' && (
                <Icon icon={icon} className={theme.icon(compiledProps)} />
            )}
        </Element>
    );
}

export namespace ButtonLink {
    export type Props = BaseProps &
        Omit<HTMLProps<HTMLAnchorElement>, 'size' | 'type'> & {
            theme?: Theme;
            href: string;
            localeCode?: LinkProps['locale'];
            forceRefresh?: boolean;
            forwardRef?: Ref<HTMLAnchorElement> | RefObject<HTMLAnchorElement>;
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
