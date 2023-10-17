# Translations for Prezly Themes

![Version](https://img.shields.io/npm/v/@prezly/themes-intl-messages)
![License](https://img.shields.io/npm/l/@prezly/themes-intl-messages)
[![Crowdin](https://badges.crowdin.net/prezly-themes/localized.svg)](https://crowdin.com)

This repo is a supplementary package for Prezly themes that need multi-language support.
It has two main exports:
- Translation files in ICU synthax compiled to work seamlessly with [react-intl] library and Crowdin.
- Typed message descriptors to use in [react-intl] `FormattedMessage` components and `formatMessage` helpers.

## Getting started



### npm
```Shell
npm install react-intl @prezly/themes-intl-messages
```

### Usage in the application

1) Import the messages for your desired locale. `localeIsoCode` refers to a ISO hyphen-code. You can check which locale codes are supported in the [theme-kit-nextjs](https://github.com/prezly/theme-kit-nextjs/blob/main/src/intl/locale.ts#L10-L57) repo.
```ts
const messages = await import(`@prezly/themes-intl-messages/messages/${localeIsoCode}.json`);
```

2) Pass the messages to the `IntlProvider` wrapper component. It should be at the top of your component tree to work properly.
```tsx
<IntlProvider
    locale={localeIsoCode}
    defaultLocale="en"
    messages={messages}
>
  {/* Your application code */}
</IntlProvider>
```

3) Use the message descriptor to render the message in your component. Your IDE should give hints on the messages structure.
```tsx
import { translations } from '@prezly/themes-intl-messages';
import { FormattedMessage } from 'react-intl';

function Component() {
  return <FormattedMessage {...translations.actions.download} />
}

```

You can check an example on how to import messages in a Next.js theme in the [Prezly Bea Theme repo](https://github.com/prezly/theme-nextjs-bea/blob/main/utils/lang.ts).

### Message descriptors structure

- `actions` -> Labels for buttons or links that trigger a specific action
- `content` -> Mostly titles for various sections of a site that are related to the displayed content in some way
- `errors` -> Messages for error pages (404/500) and form validation errors
- `search` -> Messages related to the Search module
- `subscription` -> Messages related to the Subscription module
- `misc` -> Messages not suiting in any of the above categories

---

### Documentation on updating the translations (Prezly internal)
The process of adding new translations to Prezly Themes is described in the [Notion article](https://www.notion.so/prezly/Themes-Translations-i18n-4ae8aa613db146168623dfc65d9e8359)

----

Brought to you by [Prezly](https://www.prezly.com/?utm_source=github&utm_campaign=@prezly/themes-intl-messages).

[react-intl]: https://formatjs.io/docs/react-intl
