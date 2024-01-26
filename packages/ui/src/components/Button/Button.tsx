import { isNotUndefined } from '@technically/is-not-undefined';
import type { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

import { Icon } from './Icon';
import { type BaseProps, ButtonSize, ButtonVariant } from './types';

type ClassName = string;
type Styling = ClassName | Array<ClassName>;
type StylingVariations<Props extends {}> = Partial<{
    [K in keyof Props]:
        | Styling
        | Partial<{ $on: Styling; $off: Styling }>
        | (Required<Props>[K] extends string
              ? Partial<Record<string & Required<Props>[K], Styling>>
              : never);
}>;

function compileVariationStyling<Props extends {}>(
    props: Partial<Props>,
    styling: StylingVariations<Props>,
): Styling {
    return Object.entries(styling)
        .map(([key, subStyling]): Styling[] | Styling | undefined => {
            const propName = key as keyof Props;
            const isTruthy = Boolean(props[propName]);
            if (isTruthy && typeof subStyling === 'string') {
                return subStyling;
            }
            if (isTruthy && Array.isArray(subStyling)) {
                return subStyling as Styling;
            }
            if (typeof subStyling === 'object' && subStyling !== null) {
                const prop = props[propName];
                return [
                    isTruthy ? (subStyling as any).$on : (subStyling as any).$off,
                    typeof prop === 'string' ? (subStyling as any)[prop] : undefined,
                ] as Styling[];
            }
            return undefined;
        })
        .flat()
        .filter(isNotUndefined)
        .flat();
}

function compileStyle<Props extends {}>(
    props: Partial<Props>,
    styles: (Styling | StylingVariations<Props>)[],
): ClassName {
    const classString = styles
        .map((styling): Styling | undefined => {
            if (typeof styling === 'string' || Array.isArray(styling)) {
                return styling;
            }
            if (typeof styling === 'object' && styling !== null) {
                return compileVariationStyling(props, styling);
            }
            return undefined;
        })
        .flat()
        .filter(isNotUndefined)
        .join(' ');

    return twMerge(classString);
}

function createStyle<Props extends {}>(
    ...styles: (Styling | StylingVariations<Required<Props>>)[]
) {
    return (config: Partial<Props> = {}) => compileStyle(config, styles);
}

const buttonStyle = createStyle<Button.Props>(
    'flex items-center justify-center',
    'border border-transparent bg-transparent',
    // 'focus:ring-4 focus:ring-accent-lighter',
    'focus-visible:ring-4 focus-visible:ring-accent-lighter',
    'leading-[126%]',
    {
        rounded: {
            $off: 'rounded',
            $on: 'rounded-full',
        },
        size: {
            default: 'py-3 px-4 label-large',
            small: 'py-2 px-3 label-medium',
        },
        variation: {
            primary: [
                'bg-accent border-accent text-accent-button-text',
                'hover:bg-accent-dark hover:border-accent-dark',
                // 'focus:bg-accent-dark focus:border-transparent',
                'focus-visible:bg-accent-dark focus-visible:border-transparent',
                'active:bg-accent-dark active:border-accent-dark',
                'disabled:bg-accent-lighter disabled:border-transparent disabled:opacity-50',
            ],
            secondary: [
                'bg-white border-gray-200 text-gray-800',
                'hover:border-gray-300 hover:bg-gray-50',
                // 'focus:bg-gray-50 focus:border-transparent',
                'focus-visible:bg-gray-50 focus-visible:border-transparent',
                'active:bg-gray-100 active:border-gray-400',
                'disabled:bg-white disabled:border-transparent disabled:text-gray-400',
            ],
            navigation: [
                'p-0 bg-white text-gray-800',
                'hover:text-gray-900',
                // 'focus:text-gray-950',
                'focus-visible:text-gray-950',
                'disabled:bg-white disabled:text-gray-400',
            ],
        },
    },
);

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
    const isIconOnly = Boolean(icon && !children);
    const hasLeftIcon = Boolean(icon && iconPlacement === 'left');
    const hasRightIcon = Boolean(icon && iconPlacement === 'right');

    return (
        <button
            ref={forwardRef}
            type={type}
            className={buttonStyle({ rounded, size, variation })}
            /*
                size === 'small'
                    ? `py-2 px-3 label-medium ${hasLeftIcon && 'pl-2'} ${hasRightIcon && 'pr-2'}`
                    : `py-3 px-4 label-large ${hasLeftIcon && 'pl-3'} ${hasRightIcon && 'pr-3'}`,
                Boolean(Icon) && Boolean(children) && `gap-2`,
                isIconOnly && (size === 'small' ? 'p-2' : 'p-3'),
                className,
            // })} */
            disabled={disabled || isLoading}
            {...buttonProps}
        >
            {iconPlacement === 'left' && <Icon icon={icon} />}
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
