import type { Newsroom } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';

import { getPrivacyPortalUrl } from './getPrivacyPortalUrl';

export function getDataRequestLink(
    newsroom: Pick<Newsroom, 'custom_data_request_link' | 'uuid'>,
    currentLocale: Locale,
) {
    return (
        newsroom.custom_data_request_link ||
        getPrivacyPortalUrl(newsroom, currentLocale, {
            action: 'data-request',
        })
    );
}
