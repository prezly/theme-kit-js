import type { ListItemNode, ListItemTextNode } from '@prezly/story-content-format';
import { Alignment, ListNode } from '@prezly/story-content-format';
import type { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

interface ListProps {
    node: ListNode;
}

export function List({ node, children }: PropsWithChildren<ListProps>) {
    const Tag = node.type === ListNode.Type.NUMBERED ? 'ol' : 'ul';

    return (
        <div
            className={twMerge(
                'flex',
                node.align === Alignment.LEFT && 'text-left',
                node.align === Alignment.RIGHT && 'text-right',
                node.align === Alignment.CENTER && 'text-center',
            )}
        >
            <Tag
                className={twMerge(
                    'mx-0 mt-0 mb-8 pl-6 list-inside',
                    node.type === ListNode.Type.NUMBERED ? 'list-decimal' : 'list-disc',
                )}
            >
                {children}
            </Tag>
        </div>
    );
}

interface ListItemProps {
    node: ListItemNode;
}

export function ListItem({ children }: PropsWithChildren<ListItemProps>) {
    return <li className="text-large">{children}</li>;
}

interface ListItemTextProps {
    node: ListItemTextNode;
}

export function ListItemText({ children }: PropsWithChildren<ListItemTextProps>) {
    return <>{children}</>;
}
