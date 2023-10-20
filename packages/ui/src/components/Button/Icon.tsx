import type { BaseProps } from './types';

interface Props {
    icon?: BaseProps['icon'];
}

export function Icon({ icon: IconComponent }: Props) {
    if (!IconComponent) {
        return null;
    }

    return <IconComponent width={16} height={16} className="w-[1em] h-[1em]" />;
}
