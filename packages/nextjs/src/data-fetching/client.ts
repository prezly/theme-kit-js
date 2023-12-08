import type { Story } from '@prezly/sdk';
import type { ContentDelivery } from '@prezly/theme-kit-core/server';
import { Algolia, initContentDeliveryClient } from '@prezly/theme-kit-core/server';
import type { Locale } from '@prezly/theme-kit-intl';
import type { IncomingMessage } from 'http';

import { matchLanguageFromNextLocale } from '../intl';
import type { PageProps, ServerSidePageProps } from '../types';

export type Client = ContentDelivery.Client & {
    getNewsroomServerSideProps(
        nextLocale?: Locale.AnySlug,
        story?: Pick<Story, 'culture'>,
    ): Promise<PageProps & ServerSidePageProps>;
};

export function createClient(
    contentDelivery: ContentDelivery.Client,
    request?: IncomingMessage,
): Client {
    return {
        ...contentDelivery,
        async getNewsroomServerSideProps(nextLocale, story) {
            const [
                newsroom,
                languages,
                defaultLanguage,
                defaultLocale,
                locales,
                usedLocales,
                categories,
                themePreset,
            ] = await Promise.all([
                contentDelivery.newsroom(),
                contentDelivery.languages(),
                contentDelivery.defaultLanguage(),
                contentDelivery.defaultLocale(),
                contentDelivery.locales(),
                contentDelivery.usedLocales(),
                contentDelivery.categories(),
                contentDelivery.theme(),
            ]);

            const currentLanguage = story
                ? languages.find((lang) => lang.code === story.culture.code)
                : matchLanguageFromNextLocale(nextLocale, languages);

            const { code: locale } = currentLanguage || defaultLanguage;

            // Note: These following calls depend on the `contentDelivery.languages()` result,
            //       which should be already cached at this stage.
            const [companyInformation, notifications] = await Promise.all([
                contentDelivery.companyInformation(locale),
                contentDelivery.notifications(locale),
            ]);

            const algoliaSettings = Algolia.settings(request);

            return {
                newsroomContextProps: {
                    newsroom,
                    companyInformation,
                    categories,
                    languages,
                    locale,
                    defaultLocale,
                    locales,
                    usedLocales,
                    notifications,
                    themePreset: themePreset ?? null,
                    algoliaSettings,
                },
                localeResolved: Boolean(currentLanguage),
            };
        },
    };
}

export function initClient(request?: IncomingMessage, options?: ContentDelivery.Options) {
    const contentDelivery = initContentDeliveryClient(request, {
        cache: true,
        ...options,
    });
    return createClient(contentDelivery, request);
}
