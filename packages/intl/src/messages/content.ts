import { defineMessages } from '../dsl';

export const homepage = defineMessages({
    latestStories: {
        id: 'homepage.latestStories',
        defaultMessage: 'Latest stories',
    },
    allStories: {
        id: 'homepage.allStories',
        defaultMessage: 'All stories',
    },
});

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
    titleSingular: {
        id: 'mediaGallery.titleSingular',
        defaultMessage: 'Media gallery',
    },
    imagesCount: {
        id: 'mediaGallery.imagesCount',
        defaultMessage:
            '{imagesCount, plural, =0 {No images} one {# image} few {# images} many {# images} other {# images} }',
    },
    videosCount: {
        id: 'mediaGallery.videosCount',
        defaultMessage:
            '{videosCount, plural, =0 {No videos} one {# video} few {# videos} many {# videos} other {# videos} }',
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
    managePreferencesTitle: {
        id: 'cookieConsent.managePreferencesTitle',
        defaultMessage: 'Manage cookie preferences',
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
    privacyPolicy: {
        id: 'cookieConsent.privacyPolicy',
        defaultMessage: 'Privacy Policy',
    },
    cookiePolicy: {
        id: 'cookieConsent.cookiePolicy',
        defaultMessage: 'Cookie Policy',
    },
    categoryNecessary: {
        id: 'cookieConsent.categoryNecessary',
        defaultMessage: 'Strictly Necessary cookies',
    },
    categoryNecessaryDescription: {
        id: 'cookieConsent.categoryNecessaryDescription',
        defaultMessage:
            'These cookies are essential for the proper functioning of the website and cannot be disabled.',
    },
    categoryFirstParty: {
        id: 'cookieConsent.categoryFirstParty',
        defaultMessage: 'First-party Analytics',
    },
    categoryFirstPartyDescription: {
        id: 'cookieConsent.categoryFirstPartyDescription',
        defaultMessage:
            'Cookies used to collect information about how visitors use our website, directly by us.',
    },
    categoryThirdParty: {
        id: 'cookieConsent.categoryThirdParty',
        defaultMessage: 'Third-party Cookies',
    },
    categoryThirdPartyDescription: {
        id: 'cookieConsent.categoryThirdPartyDescription',
        defaultMessage:
            'Cookies set by third-party services, such as those used for advertising, social media embeds, and website tracking.',
    },
    acceptSelection: {
        id: 'cookieConsent.acceptSelection',
        defaultMessage: 'Accept current selection',
    },
    acceptAll: {
        id: 'cookieConsent.acceptAll',
        defaultMessage: 'Accept all',
    },
    rejectAll: {
        id: 'cookieConsent.rejectAll',
        defaultMessage: 'Reject all',
    },
    managePreferences: {
        id: 'cookieConsent.managePreferences',
        defaultMessage: 'Manage preferences',
    },
});
