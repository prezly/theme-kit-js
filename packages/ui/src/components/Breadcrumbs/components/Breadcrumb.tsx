import { ChevronRightIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

export function Breadcrumb({ item, isLast, className }: Breadcrumb.Props) {
    return (
        <li
            className={twMerge(
                `flex items-center label-large gap-2`,
                !isLast && `text-gray-500 hover:text-gray-600`,
                className,
            )}
        >
            <Link href={item.href}>{item.name}</Link>
            {!isLast && <ChevronRightIcon className="w-3 h-3" />}
        </li>
    );
}

export namespace Breadcrumb {
    export interface Item {
        href: string;
        name: string;
    }

    export interface Props {
        item: Item;
        isLast: boolean;
        className?: string;
    }
}
