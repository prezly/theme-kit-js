import { ChevronRightIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

export interface BreadcrumbItem {
    url: string;
    name: string;
}

export interface Props {
    item: BreadcrumbItem;
    isLast: boolean;
    className?: string;
}

export function Breadcrumb({ item, isLast, className }: Props) {
    return (
        <li
            className={twMerge(
                `flex items-center label-large gap-2`,
                !isLast && `text-gray-500 hover:text-gray-600`,
                className,
            )}
        >
            <Link href={item.url}>{item.name}</Link>
            {!isLast && <ChevronRightIcon className="w-3 h-3" />}
        </li>
    );
}