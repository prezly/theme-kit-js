import { Component, Elements, Renderer } from '@prezly/content-renderer-react-js';
import type { ExtendedStory } from '@prezly/sdk';
import type { Node } from '@prezly/story-content-format';
import {
    AttachmentNode,
    ButtonBlockNode,
    ContactNode,
    DividerNode,
    GalleryNode,
    HeadingNode,
    ImageNode,
    LinkNode,
    ListItemNode,
    ListItemTextNode,
    ListNode,
    ParagraphNode,
    QuoteNode,
    StoryBookmarkNode,
    VariableNode,
} from '@prezly/story-content-format';
import type { PropsWithChildren } from 'react';

import '@prezly/content-renderer-react-js/styles.css';
import './ContentRenderer.css';

import {
    Attachment,
    Gallery,
    Image,
    StoryBookmark,
    StoryBookmarkContextProvider,
    Variable,
    VariableContextProvider,
} from './components';

export interface Props {
    story: ExtendedStory;
    nodes: Node | Node[];
}

export function ContentRenderer({ nodes, story }: PropsWithChildren<Props>) {
    return (
        <StoryBookmarkContextProvider referencedStories={story.referenced_entities.stories}>
            <VariableContextProvider value={{ story }}>
                <Renderer nodes={nodes} defaultComponents>
                    <Component match={ListNode.isListNode} component={Elements.List} />
                    <Component match={ListItemNode.isListItemNode} component={Elements.ListItem} />
                    <Component
                        match={ListItemTextNode.isListItemTextNode}
                        component={Elements.ListItemText}
                    />
                    {/* Title and Subtitle heading rules must be defined above the general Heading */}
                    <Component match={HeadingNode.isTitleHeadingNode} component={Elements.Ignore} />
                    <Component
                        match={HeadingNode.isSubtitleHeadingNode}
                        component={Elements.Ignore}
                    />
                    <Component match={HeadingNode.isHeadingNode} component={Elements.Heading} />
                    <Component
                        match={ParagraphNode.isParagraphNode}
                        component={Elements.Paragraph}
                    />
                    <Component match={ImageNode.isImageNode} component={Image} />
                    <Component match={GalleryNode.isGalleryNode} component={Gallery} />
                    <Component match={ContactNode.isContactNode} component={Elements.Contact} />
                    <Component match={AttachmentNode.isAttachmentNode} component={Attachment} />
                    <Component
                        match={ButtonBlockNode.isButtonBlockNode}
                        component={Elements.ButtonBlock}
                    />
                    <Component match={QuoteNode.isQuoteNode} component={Elements.Quote} />
                    <Component match={LinkNode.isLinkNode} component={Elements.Link} />
                    <Component match={DividerNode.isDividerNode} component={Elements.Divider} />
                    <Component
                        match={StoryBookmarkNode.isStoryBookmarkNode}
                        component={StoryBookmark}
                    />
                    <Component match={VariableNode.isVariableNode} component={Variable} />
                </Renderer>
            </VariableContextProvider>
        </StoryBookmarkContextProvider>
    );
}
