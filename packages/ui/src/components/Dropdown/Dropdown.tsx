import { ChevronDownIcon } from '@heroicons/react/24/solid';
import type { PropsWithChildren, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shadcn/components/ui/dropdown-menu';

export interface Props {
    label: ReactNode;
}

function DropdownComponent({ children, label }: PropsWithChildren<Props>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="w-60 p-4 bg-white flex items-center justify-between rounded border border-gray-200 outline-none label-large group">
                {label}
                <ChevronDownIcon
                    className={twMerge(
                        'w-4 h-4',
                        `group-data-[state=open]:-rotate-180 transition-transform`,
                    )}
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 -mt-[6px] border-t-0 rounded-t-none">
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
