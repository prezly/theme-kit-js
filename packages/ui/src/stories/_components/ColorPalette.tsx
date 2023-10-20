import { twMerge } from 'tailwind-merge';

import { ColorSwatch } from './ColorSwatch';

interface ColorPaletteProps {
    title: string;
    description?: string;
    colors: { name: string; hex: string }[];
}

export function ColorPalette({ title, description, colors }: ColorPaletteProps) {
    return (
        <div className={twMerge('mt-16', 'sb-unstyled')}>
            <h3 className="text-base leading-6 font-medium text-gray-500 mb-2">{title}</h3>
            {description && <h4 className="mb-5 text-sm leading-5 text-gray-500">{description}</h4>}
            <div className="grid gap-x-6 gap-y-10 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
                {colors.map(({ name, hex }) => (
                    <ColorSwatch key={hex} value={name} hex={hex} />
                ))}
            </div>
        </div>
    );
}
