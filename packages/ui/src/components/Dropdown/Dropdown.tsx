import { ChevronDownIcon } from '@heroicons/react/24/solid';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import type { PropsWithChildren, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export interface Props {
    label: ReactNode;
    className?: string;
    contentClassName?: string;
}

function DropdownComponent({
    children,
    label,
    className,
    contentClassName,
}: PropsWithChildren<Props>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={twMerge(
                    'w-60 p-4 bg-white flex items-center justify-between rounded border border-gray-200 outline-none label-large group',
                    className,
                )}
            >
                {label}
                <ChevronDownIcon
                    className={twMerge(
                        'w-4 h-4',
                        `group-data-[state=open]:-rotate-180 transition-transform`,
                    )}
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className={twMerge('w-60 -mt-[6px] border-t-0 rounded-t-none', contentClassName)}
            >
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export const Dropdown = Object.assign(DropdownComponent, {
    Label: DropdownMenuLabel,
    Group: DropdownMenuGroup,
    Item: DropdownMenuItem,
    Separator: DropdownMenuSeparator,
});
