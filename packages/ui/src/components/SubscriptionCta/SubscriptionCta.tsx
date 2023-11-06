import type { FormEvent } from 'react';
import { twMerge } from 'tailwind-merge';

import { Button } from '../Button';
import { Input } from '../Input';

export interface Props {
    className?: string;
    value: string;
    error?: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
}

export function SubscriptionCta({ className, error, value, onChange, onSubmit }: Props) {
    function handleSubmit(event?: FormEvent<HTMLFormElement>) {
        event?.preventDefault();

        onSubmit();
    }

    return (
        <div
            className={twMerge(
                'flex flex-col md:flex-row items-center py-12 md:py-24 px-6 md:px-20 gap-8 bg-gray-700',
                className,
            )}
        >
            {/* TODO: add translations */}
            <h3 className="title-large w-full md:w-1/2 text-white">Get updates in your inbox</h3>
            <form
                className="flex flex-col sm:flex-row items-center w-full md:w-1/2 gap-4"
                onSubmit={handleSubmit}
            >
                <Input
                    className="w-full"
                    error={error}
                    //  TODO: add translations
                    placeholder="Enter your email"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                />
                <Button className="shrink-0 w-full sm:w-max" type="submit">
                    Submit
                </Button>
            </form>
        </div>
    );
}
