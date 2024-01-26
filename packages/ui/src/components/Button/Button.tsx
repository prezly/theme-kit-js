import type { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

import { Icon } from './Icon';
import { type BaseProps, ButtonSize, ButtonVariant } from './types';

type Styling = StylingArray | string | null | undefined | 0 | false;
type StylingArray = Array<Styling>;

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
        .map(([key, subStyling]): Styling => {
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
                ] as Styling;
            }
            return undefined;
        })
        .flat();
}

function compileStyle<Props extends {}>(
    props: Partial<Props>,
    styles: (Styling | StylingVariations<Props>)[],
    ...extraClasses: Styling[]
): string {
    const classes = styles.map((styling): Styling => {
        if (!styling) {
            return undefined;
        }
        if (typeof styling === 'string' || Array.isArray(styling)) {
            return styling;
        }
        if (typeof styling === 'object') {
            return compileVariationStyling(props, styling);
        }
        return undefined;
    });

    return twMerge(classes, ...extraClasses);
}

function createStyle<Props extends {}>(
    ...styles: (Styling | StylingVariations<Required<Props>>)[]
) {
    return (config: Partial<Props> = {}, ...extraClasses: Styling[]) =>
        compileStyle(config, styles, ...extraClasses);
}

const buttonStyle = createStyle<Button.Props>(
    'flex items-center justify-center gap-2',
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
            default: 'p-3 label-large',
            small: 'p-2 label-medium',
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
                'hover:bg-gray-50 hover:border-gray-300',
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

const contentStyle = createStyle<Button.Props>('first:ml-1 last:mr-1 empty:hidden');

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
    return (
        <button
            ref={forwardRef}
            type={type}
            className={buttonStyle({ rounded, size, variation }, className)}
            disabled={disabled || isLoading}
            {...buttonProps}
        >
            {iconPlacement === 'left' && <Icon icon={icon} />}
            <span className={contentStyle({ size }, contentClassName)}>{children}</span>
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
