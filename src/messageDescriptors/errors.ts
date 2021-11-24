import { defineMessages } from '@formatjs/intl';

export const errors = defineMessages({
    unknown: {
        id: 'errorUnknown',
        defaultMessage: 'Something went wrong. Please try submitting the form again',
    },
    fieldRequired: {
        id: 'errorFieldRequired',
        defaultMessage: 'This field is required',
    },
    emailInvalid: {
        id: 'errorEmailInvalid',
        defaultMessage: 'Introduce a valid email address',
    },
});

export const notFound = defineMessages({
    title: {
        id: 'notFoundTitle',
        defaultMessage: 'The page you’re looking for doesn’t exist...',
    },
    subtitle: {
        id: 'notFoundSubtitle',
        defaultMessage: 'If you typed the URL yourself, check the spelling in the address bar.',
    },
});

export const serverError = defineMessages({
    title: {
        id: 'serverErrorTitle',
        defaultMessage: 'Something went wrong...',
    },
    subtitle: {
        id: 'serverErrorSubtitle',
        defaultMessage: 'Try refreshing the page or coming back a bit later.',
    },
});
