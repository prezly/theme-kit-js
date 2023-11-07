'use client';

import { CookieConsentLink } from '@prezly/analytics-nextjs';
import type { Culture, Newsroom } from '@prezly/sdk';

import { MadeWithPrezly } from '../MadeWithPrezly';

import { DataRequestLink } from './DataRequestLink';

export interface Props {
    newsroom: Pick<
        Newsroom,
        'uuid' | 'custom_data_request_link' | 'display_name' | 'is_white_labeled'
    >;
    locale: Culture['code'];
}

export function SubFooter({ newsroom, locale }: Props) {
    return (
        <div className="px-12 py-6 bg-gray-950 flex flex-col md:flex-row  md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
                <DataRequestLink
                    className="text-white text-sm underline font-medium"
                    newsroom={newsroom}
                    locale={locale}
                />
                <CookieConsentLink
                    className="text-white text-sm underline font-medium"
                    // TODO: Add translations
                    startUsingCookiesLabel="Start using cookies"
                    stopUsingCookiesLabel="Stop using cookies"
                />
            </div>
            <p className="text-white text-sm font-medium">
                Copyright &copy; {new Date().getFullYear()} {newsroom.display_name}
            </p>
            {!newsroom.is_white_labeled && <MadeWithPrezly />}
        </div>
    );
}
