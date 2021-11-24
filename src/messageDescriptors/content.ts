import { defineMessages } from '@formatjs/intl';

export const boilerplate = defineMessages({
    title: {
        id: 'boilerplateTitle',
        defaultMessage: 'About {companyName}',
    },
});

export const categories = defineMessages({
    title: {
        id: 'categoriesTitle',
        defaultMessage: 'Categories',
    },
});

export const contacts = defineMessages({
    title: {
        id: 'contactsTitle',
        defaultMessage: 'Contact',
    },
});

export const mediaGallery = defineMessages({
    title: {
        id: 'mediaGalleryTitle',
        defaultMessage: 'Media gallery',
    },
});

export const noStories = defineMessages({
    title: {
        id: 'noStoriesTitle',
        defaultMessage: 'Welcome to {newsroom}!',
    },
    subtitle: {
        id: 'noStoriesSubtitle',
        defaultMessage: 'Come back later to see new stories.',
    },
});
