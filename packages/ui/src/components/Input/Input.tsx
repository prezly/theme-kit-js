import type { FunctionComponent, InputHTMLAttributes, SVGProps } from 'react';
import { twMerge } from 'tailwind-merge';

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    inputClassName?: string;
    icon?: FunctionComponent<Omit<SVGProps<SVGElement>, 'ref'>>;
    iconPlacement?: 'left' | 'right';
}

export function Input({
    className,
    inputClassName,
    error,
    icon: Icon,
    iconPlacement = 'left',
    ...inputProps
}: Props) {
    return (
        <div className={twMerge(`flex flex-col w-max`, className)}>
            <div className="flex items-center">
                {Icon && iconPlacement === 'left' && <Icon className="w-5 h-5 mr-2" />}
                <input
                    {...inputProps}
                    className={twMerge(
                        `flex rounded bg-white items-center justify-center w-full p-4 
                    focus:outline-accent-lighter focus-within:outline-accent-lighter label-large`,
                        error && `border border-error`,
                        inputClassName,
                    )}
                />
                {Icon && iconPlacement === 'right' && <Icon className="w-5 h-5 ml-2" />}
            </div>
            {error && <span className="text-error label-medium mt-2">{error}</span>}
        </div>
    );
}
