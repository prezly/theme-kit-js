import { defineMessages } from '@formatjs/intl';

export const boilerplate = defineMessages({
    title: {
        id: 'boilerplate.title',
        defaultMessage: 'About {companyName}',
    },
    contact: {
        id: 'boilerplate.contact',
        defaultMessage: 'Contact',
    },
});

export const categories = defineMessages({
    title: {
        id: 'categories.title',
        defaultMessage: 'Categories',
    },
});

export const contacts = defineMessages({
    title: {
        id: 'contacts.title',
        defaultMessage: 'Contact us',
    },
});

export const mediaGallery = defineMessages({
    title: {
        id: 'mediaGallery.title',
        defaultMessage: 'Media galleries',
    },
});

export const noStories = defineMessages({
    title: {
        id: 'noStories.title',
        defaultMessage: 'Welcome to {newsroom}!',
    },
    subtitle: {
        id: 'noStories.subtitle',
        defaultMessage: 'Come back later to see new stories.',
    },
});

export const newsroom = defineMessages({
    title: {
        id: 'newsroom.title',
        defaultMessage: 'Site',
    },
});

export const cookieConsent = defineMessages({
    title: {
        id: 'cookieConsent.title',
        defaultMessage: 'We would like to use cookies',
    },
    description: {
        id: 'cookieConsent.subtitle',
        defaultMessage:
            'We use cookies on our website. They help us get to know you a little and how you use our website. This helps us provide a more valuable and tailored experience for you and others.',
    },
    accept: {
        id: 'cookieConsent.accept',
        defaultMessage: 'Yes, you can use cookies',
    },
    reject: {
        id: 'cookieConsent.reject',
        defaultMessage: 'No, do not use cookies',
    },
    notice: {
        id: 'cookieConsent.notice',
        defaultMessage: 'You can revoke cookies at anytime at the bottom of the page.',
    },
});
