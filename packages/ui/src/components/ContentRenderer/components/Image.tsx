'use client';

import { DOWNLOAD, useAnalytics, VIEW } from '@prezly/analytics-nextjs';
import { Elements } from '@prezly/content-renderer-react-js';
import type { ImageNode } from '@prezly/story-content-format';
import type { PropsWithChildren } from 'react';

interface Props {
    node: ImageNode;
}

export function Image({ node, children }: PropsWithChildren<Props>) {
    const { track } = useAnalytics();

    return (
        <Elements.Image
            node={node}
            onDownload={(image) => {
                track(DOWNLOAD.IMAGE, { id: image.uuid });
            }}
            onPreviewOpen={(image) => {
                track(VIEW.IMAGE, { id: image.uuid });
            }}
        >
            {children}
        </Elements.Image>
    );
}
