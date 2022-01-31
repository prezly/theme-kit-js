import { defineMessages } from '@formatjs/intl';

export const subscription = defineMessages({
    formTitle: {
        id: 'subscription.formTitle',
        defaultMessage: 'Get updates in your mailbox',
    },
    labelEmail: {
        id: 'subscription.labelEmail',
        defaultMessage: 'Your email address',
    },
    disclaimer: {
        id: 'subscription.disclaimer',
        defaultMessage:
            'By clicking "{subscribe}" I confirm I have read and agree to the {privacyPolicyLink}.',
        description:
            'The variables are replaced with text from `actions.subscribe` and `subscription.privacyPolicy` messages along with a link to the privacy policy.',
    },
    privacyPolicy: {
        id: 'subscription.privacyPolicy',
        defaultMessage: 'Privacy Policy',
    },
});
