import type { DocumentProps } from 'next/document';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import { Component } from 'react';

import { DEFAULT_LOCALE, getLocaleDirection, LocaleObject } from '../intl';
import type { PageProps } from '../types';

// Somehow extending the default Next Document class messes up with the ESM build of the package.
export class PrezlyThemeDocument extends Component<DocumentProps> {
    static getInitialProps = Document.getInitialProps;

    getLocaleCode() {
        const {
            newsroomContextProps,
            // eslint-disable-next-line no-underscore-dangle
        } = this.props.__NEXT_DATA__.props.pageProps as PageProps;

        // In some cases (like server errors) the newsroom context props will not be loaded.
        // We need to fall back to default locale to keep the app working.
        const { localeCode } = newsroomContextProps ?? { localeCode: DEFAULT_LOCALE };

        return localeCode;
    }

    render() {
        const locale = LocaleObject.fromAnyCode(this.getLocaleCode());
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
