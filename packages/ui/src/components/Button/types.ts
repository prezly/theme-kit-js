import type { FunctionComponent, Ref, SVGProps } from 'react';

export enum ButtonVariant {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
}

export enum ButtonSize {
    DEFAULT = 'default',
    SMALL = 'small',
}

export interface BaseProps {
    variation?: `${ButtonVariant}`;
    size?: `${ButtonSize}`;
    className?: string;
    icon?: FunctionComponent<Omit<SVGProps<SVGElement>, 'ref'>>;
    iconPlacement?: 'left' | 'right';
    forwardRef?: Ref<HTMLButtonElement>;
}
