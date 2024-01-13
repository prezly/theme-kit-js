import type { Story } from '@prezly/sdk';
import {
    getCompanyInformation,
    getDefaultLanguage,
    getLanguageFromStory,
    getNotifications,
    LocaleObject,
} from '@prezly/theme-kit-core';
import type { ContentDelivery } from '@prezly/theme-kit-core/server';
import { getAlgoliaSettings, initContentDeliveryClient } from '@prezly/theme-kit-core/server';
import { omitUndefined } from '@technically/omit-undefined';
import type { IncomingMessage } from 'http';

import { getLanguageFromNextLocaleIsoCode } from '../intl';
import type { PageProps, ServerSidePageProps } from '../types';

export type Client = ContentDelivery.Client & {
    getNewsroomServerSideProps(
        nextLocaleIsoCode?: string,
        story?: Pick<Story, 'culture'>,
        loadHomepageContacts?: boolean,
    ): Promise<PageProps & ServerSidePageProps>;
};

export function createClient(
    contentDelivery: ContentDelivery.Client,
    request?: IncomingMessage,
): Client {
    return {
        ...contentDelivery,
        async getNewsroomServerSideProps(nextLocaleIsoCode, story, loadHomepageContacts = false) {
            const [newsroom, languages, categories, themePreset, contacts] = await Promise.all([
                contentDelivery.newsroom(),
                contentDelivery.languages(),
                contentDelivery.categories(),
                contentDelivery.theme(),
                loadHomepageContacts ? contentDelivery.featuredContacts() : undefined,
            ]);

            const currentLanguage = story
                ? getLanguageFromStory(languages, story)
                : getLanguageFromNextLocaleIsoCode(languages, nextLocaleIsoCode);
            const defaultLanguage = getDefaultLanguage(languages);

            const { code: localeCode } = currentLanguage || defaultLanguage;
            const locale = LocaleObject.fromAnyCode(localeCode);

            const companyInformation = getCompanyInformation(languages, locale);

            const notifications = getNotifications(languages, locale);
            const algoliaSettings = getAlgoliaSettings(request);

            return {
                newsroomContextProps: omitUndefined({
                    newsroom,
                    companyInformation,
                    categories,
                    languages,
                    localeCode,
                    notifications,
                    themePreset: themePreset ?? null,
                    algoliaSettings,
                    contacts,
                }),
                localeResolved: Boolean(currentLanguage),
            };
        },
    };
}

export function initClient(request?: IncomingMessage, options?: ContentDelivery.Options) {
    const contentDelivery = initContentDeliveryClient(request, options);
    return createClient(contentDelivery, request);
}