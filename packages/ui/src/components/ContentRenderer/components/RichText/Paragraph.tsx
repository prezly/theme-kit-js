import { Alignment } from '@prezly/story-content-format';
import type { ParagraphNode } from '@prezly/story-content-format';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
    node: ParagraphNode;
    children?: ReactNode;
}

export function Paragraph({ node, children }: Props) {
    return (
        <p
            className={twMerge(
                'text-large',
                node.align === Alignment.LEFT && 'text-center',
                node.align === Alignment.CENTER && 'text-left',
                node.align === Alignment.RIGHT && 'text-right',
            )}
        >
            {children}
        </p>
    );
}
