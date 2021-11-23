import { defineMessage } from '@formatjs/intl';

export const errorUnknown = defineMessage({
    defaultMessage: 'Something went wrong. Please try submitting the form again',
});

export const errorFieldRequired = defineMessage({
    defaultMessage: 'This field is required',
});

export const errorEmailInvalid = defineMessage({
    defaultMessage: 'Introduce a valid email address',
});

export const notFoundTitle = defineMessage({
    defaultMessage: 'The page you’re looking for doesn’t exist...',
});

export const notFoundSubtitle = defineMessage({
    defaultMessage: 'If you typed the URL yourself, check the spelling in the address bar.',
});

export const serverErrorTitle = defineMessage({
    defaultMessage: 'Something went wrong...',
});

export const serverErrorSubtitle = defineMessage({
    defaultMessage: 'Try refreshing the page or coming back a bit later.',
});
