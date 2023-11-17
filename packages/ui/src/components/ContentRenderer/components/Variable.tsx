/* eslint-disable @typescript-eslint/no-use-before-define */

'use client';

import type { Story } from '@prezly/sdk';
import type { VariableNode } from '@prezly/story-content-format';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

import { StoryPublicationDate } from '@/components/StoryPublicationDate';

interface Props {
    node: VariableNode;
}

export function Variable({ node }: Props) {
    const variables = useVariables();

    if (node.key === 'publication.date' && variables.story) {
        return (
            <StoryPublicationDate
                dateFormat={variables.story.newsroom.date_format}
                publishedAt={variables.story.published_at}
                locale={variables.story.culture.code}
            />
        );
    }

    return null;
}

interface Context {
    story: Story | null;
}

const context = createContext<Context>({
    story: null,
});

export function VariableContextProvider(props: { value: Context; children: ReactNode }) {
    return <context.Provider value={props.value}>{props.children}</context.Provider>;
}

function useVariables(): Context {
    return useContext(context);
}
