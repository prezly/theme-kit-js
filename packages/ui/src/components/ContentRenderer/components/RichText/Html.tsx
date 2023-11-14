import { Elements } from '@prezly/content-renderer-react-js';
import type { HtmlNode } from '@prezly/story-content-format';

interface Props {
    node: HtmlNode;
}

export function Html({ node }: Props) {
    return <Elements.Html node={node} className="html-content" />;
}
