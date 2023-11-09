import { Alignment } from '@prezly/story-content-format';
import type { QuoteNode } from '@prezly/story-content-format';
import type { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
    node: QuoteNode;
}

export function Quote({ node, children }: PropsWithChildren<Props>) {
    const alignment = node.align ?? Alignment.LEFT;

    return (
        <blockquote
            className={twMerge(
                'flex my-10 mx-auto',
                alignment === Alignment.LEFT && 'text-left',
                alignment === Alignment.CENTER && 'text-center',
                alignment === Alignment.RIGHT && 'text-right',
            )}
        >
            <div className="p-5 subtitle-small relative before:content-[''] before:border-l-4 before:border-l-gray-200 before:absolute before:left-0 before:top-0 before:bottom-0">
                {children}
            </div>
        </blockquote>
    );
}
