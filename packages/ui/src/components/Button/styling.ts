/* eslint-disable @typescript-eslint/no-use-before-define */
import { twMerge } from 'tailwind-merge';

export type Styling = StylingArray | string | null | undefined | 0 | false;
export type StylingArray = Array<Styling>;

export type StylingVariations<Props extends {}> = Partial<{
    [K in keyof Props]:
        | Styling
        | Partial<{ $on: Styling; $off: Styling }>
        | (Required<Props>[K] extends string
              ? Partial<Record<string & Required<Props>[K], Styling>>
              : never);
}>;

export function createStyle<Props extends {}>(
    ...styles: (Styling | StylingVariations<Required<Props>>)[]
) {
    return (config: Partial<Props> = {}, ...extraClasses: Styling[]) =>
        compileStyle(config, styles, ...extraClasses);
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
