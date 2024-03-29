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

import { ContactCard } from '../ContactCard';

import {
    Attachment,
    Gallery,
    Heading,
    Image,
    Link,
    List,
    ListItem,
    ListItemText,
    Paragraph,
    Quote,
    StoryBookmark,
    StoryBookmarkContextProvider,
    Variable,
    VariableContextProvider,
} from './components';

export function ContentRenderer({ nodes, story, intl }: ContentRenderer.Props) {
    return (
        <StoryBookmarkContextProvider referencedStories={story.referenced_entities.stories}>
            <VariableContextProvider value={{ story }}>
                <Renderer nodes={nodes} defaultComponents>
                    <Component match={ListNode.isListNode} component={List} />
                    <Component match={ListItemNode.isListItemNode} component={ListItem} />
                    <Component
                        match={ListItemTextNode.isListItemTextNode}
                        component={ListItemText}
                    />
                    {/* Title and Subtitle heading rules must be defined above the general Heading */}
                    <Component match={HeadingNode.isTitleHeadingNode} component={Elements.Ignore} />
                    <Component
                        match={HeadingNode.isSubtitleHeadingNode}
                        component={Elements.Ignore}
                    />
                    <Component match={HeadingNode.isHeadingNode} component={Heading} />
                    <Component match={ParagraphNode.isParagraphNode} component={Paragraph} />
                    <Component match={ImageNode.isImageNode} component={Image} />
                    <Component match={GalleryNode.isGalleryNode} component={Gallery} />
                    <Component
                        match={ContactNode.isContactNode}
                        component={({ node }) => (
                            <ContactCard
                                className="max-w-full"
                                contact={{ ...node.contact, avatar_image: null }}
                            />
                        )}
                    />
                    <Component
                        match={AttachmentNode.isAttachmentNode}
                        component={({ node }) => <Attachment node={node} intl={intl} />}
                    />
                    <Component
                        match={ButtonBlockNode.isButtonBlockNode}
                        component={Elements.ButtonBlock}
                    />
                    <Component match={QuoteNode.isQuoteNode} component={Quote} />
                    <Component match={LinkNode.isLinkNode} component={Link} />
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

export namespace ContentRenderer {
    export type Intl = Attachment.Intl;

    export type Props = PropsWithChildren<{
        story: ExtendedStory;
        nodes: Node | Node[];
        intl?: Partial<Intl>;
    }>;
}
