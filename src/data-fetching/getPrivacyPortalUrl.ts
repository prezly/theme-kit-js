import { LocaleObject } from '@prezly/libs/intl';
import type { Newsroom } from '@prezly/sdk';

type PrivacyPortalUrlOptions = { email?: string; action?: 'subscribe' | 'unsubscribe' };

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
