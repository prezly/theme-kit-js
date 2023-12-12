import type { Newsroom } from '@prezly/sdk';
import { Locale } from '@prezly/theme-kit-intl';

import { PRIVACY_PORTAL_URL } from './constants';

type PrivacyPortalUrlOptions = {
    email?: string;
    action?: 'data-request' | 'subscribe' | 'unsubscribe';
};

export function generateUrl(
    newsroom: Pick<Newsroom, 'uuid'>,
    locale: Locale | Locale.AnyCode,
    options?: PrivacyPortalUrlOptions,
) {
    const { email, action = 'subscribe' } = options || {};
    const { slug } = Locale.from(locale);

    const url = new URL(`/${slug}/newsroom/${newsroom.uuid}/${action}`, PRIVACY_PORTAL_URL);
    if (email) {
        url.searchParams.append('email', email);
    }
    return url.toString();
}

export function getDataRequestUrl(
    newsroom: Pick<Newsroom, 'custom_data_request_link' | 'uuid'>,
    locale: Locale.Code,
) {
    return (
        newsroom.custom_data_request_link ||
        generateUrl(newsroom, locale, { action: 'data-request' })
    );
}
