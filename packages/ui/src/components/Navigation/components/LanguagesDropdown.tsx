'use client';

import { CheckIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import type { Culture } from '@prezly/sdk';
import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

import { Dropdown } from '@/components/Dropdown';
import { useDevice } from '@/hooks';

type Props = LanguagesDropdown.Props;

export function LanguagesDropdown({ selected, options }: Props) {
    const { isSm } = useDevice();

    const displayedOptions = useMemo(
        () => [...options].sort((a, b) => a.name.localeCompare(b.name)),
        [options],
    );

    return (
        <Dropdown
            className="border-0 w-max p-0 bg-transparent text-gray-600 hover:text-gray-800"
            contentProps={{
                className: 'border mt-2 p-0 mb-5 overflow-auto',
                side: isSm ? 'bottom' : 'left',
            }}
            label={<GlobeAltIcon className="w-6 h-6" />}
        >
            <Dropdown.Group>
                {displayedOptions.map(({ code, name, href }, index) => (
                    <Dropdown.Item
                        className={twMerge(
                            'border-b border-gray-200',
                            index === displayedOptions.length - 1 && `border-b-0`,
                        )}
                        key={code}
                    >
                        <a className="px-6 py-4 flex items-center justify-between" href={href}>
                            <span>{name}</span>
                            {selected && code === selected.code && (
                                <CheckIcon className="w-[20px] h-[20px]" />
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
