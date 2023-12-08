import { DEFAULT_LOCALE, Locale } from '@prezly/theme-kit-intl';
import Document, { Head, Html, Main, NextScript } from 'next/document';

import type { PageProps } from '../types';

export class PrezlyThemeDocument extends Document {
    getLocaleCode() {
        const {
            newsroomContextProps,
            // eslint-disable-next-line no-underscore-dangle
        } = this.props.__NEXT_DATA__.props.pageProps as PageProps;

        // In some cases (like server errors) the newsroom context props will not be loaded.
        // We need to fall back to default locale to keep the app working.
        const { locale = DEFAULT_LOCALE } = newsroomContextProps ?? {};

        return locale;
    }

    render() {
        // TODO: The direction can be pulled from the Language object
        const { isoCode, direction } = Locale.from(this.getLocaleCode());

        return (
            <Html lang={isoCode} dir={direction}>
                <Head>
                    <meta name="og:locale" content={isoCode} />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
