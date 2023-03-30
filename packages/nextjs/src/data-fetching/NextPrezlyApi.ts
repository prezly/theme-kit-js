import type { Story } from '@prezly/sdk';
import {
    getAlgoliaSettings,
    getCompanyInformation,
    getDefaultLanguage,
    getLanguageFromStory,
    getNotifications,
    LocaleObject,
    PrezlyApi,
} from '@prezly/theme-kit-core';
import type { IncomingMessage } from 'http';

import { getLanguageFromNextLocaleIsoCode } from '../intl';
import type { PageProps, ServerSidePageProps } from '../types';

export class NextPrezlyApi extends PrezlyApi {
    async getNewsroomServerSideProps(
        request?: IncomingMessage,
        nextLocaleIsoCode?: string,
        story?: Story,
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

        // TODO: if no information given for current language, show boilerplate from default language
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
