import { ChevronDownIcon } from '@heroicons/react/24/solid';
import {
    DropdownMenu,
    DropdownMenuContent,
    type DropdownMenuContentProps,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import type { ComponentPropsWithoutRef, ElementRef, PropsWithChildren, ReactNode } from 'react';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export interface Props {
    label: ReactNode;
    className?: string;
    contentProps?: DropdownMenuContentProps;
}

function DropdownComponent({ children, label, className, contentProps }: PropsWithChildren<Props>) {
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
                {...contentProps}
                className={twMerge(
                    'w-60 px-1 pb-2 -mt-1 rounded-t-none bg-white border border-gray-200 border-t-0 rounded-b',
                    contentProps?.className,
                )}
            >
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

const DropdownItem = forwardRef<
    ElementRef<typeof DropdownMenuItem>,
    ComponentPropsWithoutRef<typeof DropdownMenuItem>
>(({ className, ...props }, ref) => (
    <DropdownMenuItem
        className={twMerge(
            `label-medium px-3 py-2 focus:bg-transparent cursor-pointer outline-none rounded
            hover:bg-gray-100 focus:bg-gray-100
            `,
            className,
        )}
        ref={ref}
        {...props}
    />
));
DropdownItem.displayName = 'DropdownItem';

export const Dropdown = Object.assign(DropdownComponent, {
    Label: DropdownMenuLabel,
    Group: DropdownMenuGroup,
    Item: DropdownItem,
    Separator: DropdownMenuSeparator,
});
