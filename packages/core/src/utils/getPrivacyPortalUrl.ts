import type { Newsroom } from '@prezly/sdk';
import { Locale } from '@prezly/theme-kit-intl';

import { PRIVACY_PORTAL_URL } from '../constants';

type PrivacyPortalUrlOptions = {
    email?: string;
    action?: 'data-request' | 'subscribe' | 'unsubscribe';
};

export function getPrivacyPortalUrl(
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
