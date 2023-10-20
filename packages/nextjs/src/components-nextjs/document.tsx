import { DEFAULT_LOCALE } from '@prezly/theme-kit-core';
import { Locale } from '@prezly/theme-kit-intl';
import Document, { Head, Html, Main, NextScript } from 'next/document';

import type { PageProps } from '../types';

export class PrezlyThemeDocument extends Document {
    getLocaleCode() {
        const {
            newsroomContextProps,
            // eslint-disable-next-line no-underscore-dangle
        } = this.props.__NEXT_DATA__.props.pageProps as Partial<PageProps>;

        // In some cases (like server errors) the newsroom context props will not be loaded.
        // We need to fall back to default locale to keep the app working.
        const { localeCode } = newsroomContextProps ?? { localeCode: DEFAULT_LOCALE };

        return localeCode;
    }

    render() {
        const locale = Locale.from(this.getLocaleCode());

        return (
            <Html lang={locale.isoCode} dir={locale.direction}>
                <Head>
                    <meta name="og:locale" content={locale.isoCode} />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
