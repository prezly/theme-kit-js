import { twMerge } from 'tailwind-merge';

import type { BaseProps } from './types';

interface Props {
    icon?: BaseProps['icon'];
    placement: 'left' | 'right';
    iconOnly?: boolean;
}

export function Icon({ icon: IconComponent, placement, iconOnly }: Props) {
    const isLeft = placement === 'left';

    if (IconComponent) {
        return (
            <IconComponent
                width={16}
                height={16}
                className={twMerge('w-[1em] h-[1em]', !iconOnly && (isLeft ? 'mr-2' : 'ml-2'))}
            />
        );
    }

    return null;
}
