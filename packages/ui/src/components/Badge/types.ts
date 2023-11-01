import type { FunctionComponent, Ref, SVGProps } from 'react';

export enum BadgeVariant {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
}

export enum BadgeSize {
    DEFAULT = 'default',
    SMALL = 'small',
}

export interface BaseProps {
    variation?: `${BadgeVariant}`;
    size?: `${BadgeSize}`;
    className?: string;
    icon?: FunctionComponent<Omit<SVGProps<SVGElement>, 'ref'>>;
    iconPlacement?: 'left' | 'right';
    forwardRef?: Ref<HTMLButtonElement>;
}
