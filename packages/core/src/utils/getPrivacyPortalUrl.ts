import type { Newsroom } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';

type PrivacyPortalUrlOptions = {
    email?: string;
    action?: 'data-request' | 'subscribe' | 'unsubscribe';
};

export function getPrivacyPortalUrl(
    newsroom: Pick<Newsroom, 'uuid'>,
    locale: Locale,
    options?: PrivacyPortalUrlOptions,
) {
    const { email, action = 'subscribe' } = options || {};

    const url = new URL(
        `/${locale.slug}/newsroom/${newsroom.uuid}/${action}`,
        'https://privacy.prezly.com',
    );
    if (email) {
        url.searchParams.append('email', email);
    }
    return url.toString();
}
