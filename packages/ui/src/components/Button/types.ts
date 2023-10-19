import type { FunctionComponent, SVGProps } from 'react';

export enum ButtonVariants {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
}

export enum ButtonSize {
    DEFAULT = 'default',
    SMALL = 'small',
}

export interface BaseProps {
    variation?: `${ButtonVariants}`;
    size?: `${ButtonSize}`;
    className?: string;
    icon?: FunctionComponent<Omit<SVGProps<SVGElement>, 'ref'>>;
    iconPlacement?: 'left' | 'right';
}
