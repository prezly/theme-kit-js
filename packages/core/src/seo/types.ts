import type { Culture } from '@prezly/sdk';

export type AlternateLanguageLink = {
    href: string;
    hrefLang: Culture.IsoCode | 'x-default';
    type: 'exact' | 'alias' | 'x-default';
};
