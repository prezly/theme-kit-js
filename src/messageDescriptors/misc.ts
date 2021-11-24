import { defineMessage } from '@formatjs/intl';

export const misc = defineMessage({
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
});
