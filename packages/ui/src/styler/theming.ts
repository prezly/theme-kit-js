import { twMerge } from 'tailwind-merge';

import type { ClassNames } from './styling';

type StylingFn<Props extends {}> = (props: Props, ...classNames: ClassNames[]) => string;

export type Theme<Element extends string, Props extends {} = {}> = {
    [E in Element]: StylingFn<Props>;
};

type ThemeExtension<Element extends string, Props extends {}> = Partial<{
    [E in Element]: ClassNames | ((props: Partial<Props>) => ClassNames);
}>;

export function extendTheme<Element extends string, Props extends {} | never>(
    theme: Theme<Element, Props>,
    extension: ThemeExtension<Element, Props>,
): Theme<Element, Props> {
    return Object.fromEntries(
        Object.keys(theme).map((element): [Element, StylingFn<Props>] => [
            element as Element,
            (props: Props, ...classNames: ClassNames[]) => {
                const base = theme[element as Element](props);
                const ext = extension[element as Element];
                if (typeof ext === 'function') {
                    return twMerge(base, ext(props), ...classNames);
                }
                if (ext) {
                    return twMerge(base, ext, ...classNames);
                }
                return twMerge(base, ...classNames);
            },
        ]),
    ) as Theme<Element, Props>;
}
