import type { FormEvent, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { Button } from '../Button';
import { Input } from '../Input';

export function SubscriptionCta({
    className,
    error,
    value,
    onChange,
    onSubmit,
    intl = {},
    children,
}: SubscriptionCta.Props) {
    return (
        <div
            className={twMerge(
                'flex flex-col md:flex-row items-start py-12 md:py-24 px-6 md:px-20 gap-8 bg-gray-700',
                className,
            )}
        >
            <h3 className="title-large w-full md:w-1/2 text-white">
                {intl['subscription.formTitle'] ?? 'Get updates in your mailbox'}
            </h3>
            <form
                className="flex flex-col sm:flex-row items-start w-full md:w-1/2 gap-4"
                onSubmit={onSubmit}
            >
                <Input
                    className="w-full"
                    inputClassName="py-3 px-4"
                    error={error}
                    placeholder={intl['subscription.labelEmail'] ?? 'Enter your email'}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                />
                {children}
                <Button className="shrink-0 w-full sm:w-max" type="submit">
                    {intl['actions.subscribe'] ?? 'Subscribe'}
                </Button>
            </form>
        </div>
    );
}

export namespace SubscriptionCta {
    export interface Intl {
        ['subscription.formTitle']: string;
        ['subscription.labelEmail']: string;
        ['actions.subscribe']: string;
    }

    export interface Props {
        className?: string;
        value: string;
        error?: string;
        onChange: (value: string) => void;
        onSubmit: (event: FormEvent) => void;
        intl?: Partial<Intl>;
        children?: ReactNode;
    }
}
