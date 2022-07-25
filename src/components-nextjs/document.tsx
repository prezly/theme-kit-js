import Document, { Head, Html, Main, NextScript } from 'next/document';

import { DEFAULT_LOCALE, getLocaleDirection, LocaleObject } from '../intl';
import type { PageProps } from '../types';

export class PrezlyThemeDocument extends Document {
    render() {
        const {
            newsroomContextProps: { localeCode = DEFAULT_LOCALE },
            // eslint-disable-next-line no-underscore-dangle
        } = this.props.__NEXT_DATA__.props.pageProps as PageProps;

        const locale = LocaleObject.fromAnyCode(localeCode);
        // TODO: The direction can be pulled from the Language object
        const direction = getLocaleDirection(locale);

        return (
            <Html lang={locale.toHyphenCode()} dir={direction}>
                <Head>
                    <meta name="og:locale" content={locale.toHyphenCode()} />
                    {/* TODO: Add alternate locales */}
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
