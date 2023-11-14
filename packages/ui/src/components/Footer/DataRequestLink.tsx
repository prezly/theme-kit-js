import type { Culture, Newsroom } from '@prezly/sdk';
import { getDataRequestLink } from '@prezly/theme-kit-core';

interface Props {
    className?: string;
    newsroom: Pick<Newsroom, 'uuid' | 'custom_data_request_link'>;
    locale: Culture['code'];
}

export function DataRequestLink({ className, newsroom, locale }: Props) {
    const href = getDataRequestLink(newsroom, locale);

    return (
        <a href={href} className={className}>
            {/* TODO: add translations */}
            Data requests
        </a>
    );
}
