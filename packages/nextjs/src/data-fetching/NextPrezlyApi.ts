import type { Story } from '@prezly/sdk';
import {
    getCompanyInformation,
    getDefaultLanguage,
    getLanguageFromStory,
    getNotifications,
} from '@prezly/theme-kit-core';
import { getAlgoliaSettings, PrezlyApi } from '@prezly/theme-kit-core/server';
import { Locale } from '@prezly/theme-kit-intl';
import type { IncomingMessage } from 'http';

import { matchLanguageByRequestedLocaleSlug } from '../intl';
import type { PageProps, ServerSidePageProps } from '../types';

export class NextPrezlyApi extends PrezlyApi {
    async getNewsroomServerSideProps(
        request?: IncomingMessage,
        localeSlug?: string,
        story?: Pick<Story, 'culture'>,
    ): Promise<PageProps & ServerSidePageProps> {
        const [newsroom, languages, categories, themePreset] = await Promise.all([
            this.getNewsroom(),
            this.getNewsroomLanguages(),
            this.getCategories(),
            this.getThemePreset(),
        ]);

        const currentLanguage = story
            ? getLanguageFromStory(languages, story)
            : matchLanguageByRequestedLocaleSlug(languages, localeSlug);
        const defaultLanguage = getDefaultLanguage(languages);

        const { code: localeCode } = currentLanguage || defaultLanguage;
        const locale = Locale.from(localeCode);

        const companyInformation = getCompanyInformation(languages, locale);

        const notifications = getNotifications(languages, locale);
        const algoliaSettings = getAlgoliaSettings(request);

        return {
            newsroomContextProps: {
                newsroom,
                companyInformation,
                categories,
                languages,
                localeCode,
                notifications,
                themePreset,
                algoliaSettings,
            },
            localeResolved: Boolean(currentLanguage),
        };
    }
}
