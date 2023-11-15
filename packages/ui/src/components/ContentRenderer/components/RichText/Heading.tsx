import { Alignment, HeadingNode } from '@prezly/story-content-format';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
    node: HeadingNode;
    children?: ReactNode;
}

export function Heading({ node, children }: Props) {
    const className = twMerge(
        'text-gray-800 mt-10 mb-4 mx-auto',
        node.type === HeadingNode.Type.HEADING_ONE ? 'title-large' : 'title-medium',
        node.align === Alignment.LEFT && 'text-center',
        node.align === Alignment.CENTER && 'text-left',
        node.align === Alignment.RIGHT && 'text-right',
    );

    if (node.type === HeadingNode.Type.HEADING_ONE) {
        return <h2 className={className}>{children}</h2>;
    }

    return <h3 className={className}>{children}</h3>;
}
