import type { Newsroom } from '@prezly/sdk';

import type { LocaleObject } from '../intl';

import { getPrivacyPortalUrl } from './getPrivacyPortalUrl';

export function getDataRequestLink(
    newsroom: Pick<Newsroom, 'custom_data_request_link' | 'uuid'>,
    currentLocale: LocaleObject,
) {
    return (
        newsroom.custom_data_request_link ||
        getPrivacyPortalUrl(newsroom, currentLocale, {
            action: 'data-request',
        })
    );
}
