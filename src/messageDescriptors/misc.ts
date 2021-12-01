import { defineMessages } from '@formatjs/intl';

export const misc = defineMessages({
    embargoMessage: {
        id: 'misc.embargoMessage',
        defaultMessage: 'Embargo until {date}',
        description:
            'Embargo means that the story is not allowed to be shared before the specified date',
    },
    stateLoading: {
        id: 'misc.loading',
        defaultMessage: 'Loading...',
    },
    shareUrlCopied: {
        id: 'misc.shareUrlCopied',
        defaultMessage: 'URL copied!',
    },
    toggleMobileNavigation: {
        id: 'misc.toggleMobileNavigation',
        defaultMessage: 'Toggle navigation',
        description: 'A tooltip for a button that toggles the mobile menu on the web page',
    },
});
