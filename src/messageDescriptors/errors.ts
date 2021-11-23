import { defineMessage } from '@formatjs/intl';

export const errorUnknown = defineMessage({
    id: 'errorUnknown',
    defaultMessage: 'Something went wrong. Please try submitting the form again',
});

export const errorFieldRequired = defineMessage({
    id: 'errorFieldRequired',
    defaultMessage: 'This field is required',
});

export const errorEmailInvalid = defineMessage({
    id: 'errorEmailInvalid',
    defaultMessage: 'Introduce a valid email address',
});

export const notFoundTitle = defineMessage({
    id: 'notFoundTitle',
    defaultMessage: 'The page you’re looking for doesn’t exist...',
});

export const notFoundSubtitle = defineMessage({
    id: 'notFoundSubtitle',
    defaultMessage: 'If you typed the URL yourself, check the spelling in the address bar.',
});

export const serverErrorTitle = defineMessage({
    id: 'serverErrorTitle',
    defaultMessage: 'Something went wrong...',
});

export const serverErrorSubtitle = defineMessage({
    id: 'serverErrorSubtitle',
    defaultMessage: 'Try refreshing the page or coming back a bit later.',
});
