import { STORY_LINK, useAnalytics } from '@prezly/analytics-nextjs';
import type { LinkNode } from '@prezly/story-content-format';
import type { ReactNode } from 'react';

interface Props {
    node: LinkNode;
    children?: ReactNode;
}

export function Link({ node, children }: Props) {
    const { track } = useAnalytics();
    const { href } = node;

    function handleClick() {
        track(STORY_LINK.CLICK, { href });
    }

    return (
        <a
            className="text-accent hover:text-accent-dark active:text-accent-dark focus:text-accent-dark focus-within:text-accent-dark"
            href={href}
            onClick={handleClick}
            rel="noopener noreferrer"
            target={node.new_tab ? '_blank' : '_self'}
        >
            {children}
        </a>
    );
}
