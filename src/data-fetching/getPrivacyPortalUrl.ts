import type { Newsroom } from '@prezly/sdk';

import type { LocaleObject } from '../intl';

type PrivacyPortalUrlOptions = {
    email?: string;
    action?: 'data-request' | 'subscribe' | 'unsubscribe';
};

export function getPrivacyPortalUrl(
    newsroom: Newsroom,
    locale: LocaleObject,
    options?: PrivacyPortalUrlOptions,
) {
    const { email, action = 'subscribe' } = options || {};

    const url = new URL(
        `/${locale.toUrlSlug()}/newsroom/${newsroom.uuid}/${action}`,
        'https://privacy.prezly.com',
    );
    if (email) {
        url.searchParams.append('email', email);
    }
    return url.toString();
}
