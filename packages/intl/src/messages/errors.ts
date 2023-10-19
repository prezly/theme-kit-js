import { defineMessages } from '@formatjs/intl';

export const errors = defineMessages({
    unknown: {
        id: 'errors.unknown',
        defaultMessage: 'Something went wrong. Please try submitting the form again',
    },
    fieldRequired: {
        id: 'errors.fieldRequired',
        defaultMessage: 'This field is required',
    },
    emailInvalid: {
        id: 'errors.emailInvalid',
        defaultMessage: 'Introduce a valid email address',
    },
});

export const notFound = defineMessages({
    title: {
        id: 'notFound.title',
        defaultMessage: 'The page you’re looking for doesn’t exist...',
    },
    subtitle: {
        id: 'notFound.subtitle',
        defaultMessage: 'If you typed the URL yourself, check the spelling in the address bar.',
    },
});

export const serverError = defineMessages({
    title: {
        id: 'serverError.title',
        defaultMessage: 'Something went wrong...',
    },
    subtitle: {
        id: 'serverError.subtitle',
        defaultMessage: 'Try refreshing the page or coming back a bit later.',
    },
});
