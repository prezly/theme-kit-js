import type { FunctionComponent, SVGProps } from 'react';

export enum LinkVariant {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
}

export enum LinkSize {
    DEFAULT = 'default',
    SMALL = 'small',
}

export interface BaseProps {
    variation?: `${LinkVariant}`;
    size?: `${LinkSize}`;
    className?: string;
    icon?: FunctionComponent<Omit<SVGProps<SVGElement>, 'ref'>>;
    iconPlacement?: 'left' | 'right';
}
