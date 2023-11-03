import { twMerge } from 'tailwind-merge';

import type { BaseProps } from './types';

interface Props {
    icon?: BaseProps['icon'];
    className?: string;
}

export function Icon({ icon: IconComponent, className }: Props) {
    if (!IconComponent) {
        return null;
    }

    return <IconComponent className={twMerge('w-[1em] h-[1em]', className)} />;
}
