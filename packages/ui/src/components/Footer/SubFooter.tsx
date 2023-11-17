'use client';

import { CookieConsentLink } from '@prezly/analytics-nextjs';

import { MadeWithPrezly } from '../MadeWithPrezly';

import { DataRequestLink } from './DataRequestLink';

export function SubFooter({
    privacyRequestLink,
    isWhiteLabeled,
    newsroomDisplayName,
    intl = {},
}: SubFooter.Props) {
    return (
        <div className="px-12 py-6 bg-gray-950 flex flex-col md:flex-row  md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
                <DataRequestLink
                    className="text-white text-sm underline font-medium"
                    privacyRequestLink={privacyRequestLink}
                    intl={intl}
                />
                <CookieConsentLink
                    className="text-white text-sm underline font-medium"
                    startUsingCookiesLabel={
                        intl['actions.startUsingCookies'] ?? 'Start using cookies'
                    }
                    stopUsingCookiesLabel={intl['actions.stopUsingCookies'] ?? 'Stop using cookies'}
                />
            </div>
            <p className="text-white text-sm font-medium">
                Copyright &copy; {new Date().getFullYear()} {newsroomDisplayName}
            </p>
            {!isWhiteLabeled && <MadeWithPrezly />}
        </div>
    );
}

export namespace SubFooter {
    export interface Intl extends DataRequestLink.Intl {
        ['actions.startUsingCookies']: string;
        ['actions.stopUsingCookies']: string;
    }

    export interface Props {
        privacyRequestLink: string;
        isWhiteLabeled?: boolean;
        newsroomDisplayName: string;
        intl?: Partial<Intl>;
    }
}
