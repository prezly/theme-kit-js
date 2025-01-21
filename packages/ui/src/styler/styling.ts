import { isNotUndefined } from '@technically/is-not-undefined';
import { twMerge } from 'tailwind-merge';

export type Styling<Props extends {}> = ClassNames | ClassNamesMapping<Props>;

export type ClassNames = ClassNamesArray | string | null | undefined | 0 | false;
type ClassNamesArray = Array<ClassNames>;
type ClassNamesMapping<Props extends {}> = Partial<{
    [K in keyof Props]:
        | ClassNames
        | Partial<{ $on: ClassNames; $off: ClassNames }>
        | (Required<Props>[K] extends string
              ? Partial<Record<string & Required<Props>[K], ClassNames>>
              : never);
}>;

export function createStyling<Props extends {}>(...styles: Styling<Required<Props>>[]) {
    return (config: Partial<Props> = {}, ...extraClasses: ClassNames[]) =>
        twMerge(...compileStyling(config, styles), ...extraClasses);
}

function compileStyling<Props extends {}>(
    props: Partial<Props>,
    styles: Styling<Props>[],
): string[] {
    return styles
        .map((styling) => {
            if (!styling) {
                return undefined;
            }
            if (typeof styling === 'string') {
                return styling;
            }
            if (Array.isArray(styling)) {
                return compileStyling(props, styling);
            }
            if (typeof styling === 'object') {
                return compileMapping(props, styling);
            }
            return undefined;
        })
        .filter(isNotUndefined)
        .flat();
}

function compileMapping<Props extends {}>(
    props: Partial<Props>,
    mapping: ClassNamesMapping<Props>,
): string[] {
    const parts = Object.entries(mapping)
        .map(([key, subStyling]): ClassNames => {
            const propName = key as keyof Props;
            const isTruthy = Boolean(props[propName]);

            if (isTruthy && typeof subStyling === 'string') {
                return subStyling;
            }
            if (isTruthy && Array.isArray(subStyling)) {
                return compileStyling(props, subStyling);
            }
            if (typeof subStyling === 'object' && subStyling !== null) {
                const prop = props[propName];
                return [
                    isTruthy ? (subStyling as any).$on : (subStyling as any).$off,
                    typeof prop === 'string' ? (subStyling as any)[prop] : undefined,
                ] as ClassNames;
            }
            return undefined;
        })
        .filter(isNotUndefined)
        .flat();

    return compileStyling(props, parts);
}
