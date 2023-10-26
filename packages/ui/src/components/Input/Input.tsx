import type { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    inputClassName?: string;
}

export function Input({ className, inputClassName, error, ...inputProps }: Props) {
    return (
        <div className={twMerge(`flex flex-col`, className)}>
            <input
                {...inputProps}
                className={twMerge(
                    `flex rounded bg-white items-center justify-center w-max p-4 
                    focus:outline-accent-lighter focus-within:outline-accent-lighter label-large`,
                    error && `border border-error`,
                    inputClassName,
                )}
            />
            {error && <span className="text-error label-medium mt-2">{error}</span>}
        </div>
    );
}
