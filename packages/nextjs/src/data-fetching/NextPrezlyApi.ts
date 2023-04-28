import type { Story } from '@prezly/sdk';
import {
    getCompanyInformation,
    getDefaultLanguage,
    getLanguageFromStory,
    getNotifications,
    LocaleObject,
} from '@prezly/theme-kit-core';
import { getAlgoliaSettings, PrezlyApi } from '@prezly/theme-kit-core/server';
import type { IncomingMessage } from 'http';

import { getLanguageFromNextLocaleIsoCode } from '../intl';
import type { PageProps, ServerSidePageProps } from '../types';

export class NextPrezlyApi extends PrezlyApi {
    async getNewsroomServerSideProps(
        request?: IncomingMessage,
        nextLocaleIsoCode?: string,
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
            : getLanguageFromNextLocaleIsoCode(languages, nextLocaleIsoCode);
        const defaultLanguage = getDefaultLanguage(languages);

        const { code: localeCode } = currentLanguage || defaultLanguage;
        const locale = LocaleObject.fromAnyCode(localeCode);

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
