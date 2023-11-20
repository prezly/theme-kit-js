'use client';

import { CheckIcon } from '@heroicons/react/24/outline';
import { GlobeEuropeAfricaIcon } from '@heroicons/react/24/solid';
import type { Culture } from '@prezly/sdk';
import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

import { Dropdown } from '@/components/Dropdown';
import { useDevice } from '@/hooks';

export function LanguagesDropdown({ selected, options }: LanguagesDropdown.Props) {
    const { isSm } = useDevice();

    const displayedOptions = useMemo(
        () => [...options].sort((a, b) => a.name.localeCompare(b.name)),
        [options],
    );

    return (
        <Dropdown
            className="border-0 w-max p-0 bg-transparent text-gray-600 hover:text-gray-800"
            contentProps={{
                className: 'border mt-2 p-0 mb-5 overflow-auto rounded shadow-large',
                side: isSm ? 'bottom' : 'left',
            }}
            label={<GlobeEuropeAfricaIcon className="w-6 h-6" />}
        >
            <Dropdown.Group>
                {displayedOptions.map(({ code, name, href }) => (
                    <Dropdown.Item
                        className={twMerge('border-b border-gray-200 p-0', 'last:border-b-0')}
                        key={code}
                    >
                        <a className="px-6 py-4 flex items-center justify-between" href={href}>
                            <span className="label-medium">{name}</span>
                            {selected && code === selected.code && (
                                <CheckIcon className="w-4 h-4" />
                            )}
                        </a>
                    </Dropdown.Item>
                ))}
            </Dropdown.Group>
        </Dropdown>
    );
}

export namespace LanguagesDropdown {
    type WithoutRegion<T> = T;

    export interface Option {
        code: Culture['code'];
        name: Culture['native_name'] | WithoutRegion<Culture['native_name']>;
        href: `/${string}`;
    }

    export interface Props {
        selected?: LanguagesDropdown.Option;
        options: LanguagesDropdown.Option[];
    }
}
