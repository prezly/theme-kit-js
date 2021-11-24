import { defineMessages } from '@formatjs/intl';

export const subscription = defineMessages({
    formTitle: {
        id: 'subscribeFormTitle',
        defaultMessage: 'Get updates in your mailbox',
    },
    labelEmail: {
        id: 'labelEmail',
        defaultMessage: 'Your email address',
    },
    captchaDisclaimer: {
        id: 'captchaDisclaimer',
        defaultMessage:
            'This site is protected by hCaptcha and its {privacyPolicyLink} and {termsOfServiceLink} apply.',
    },
    privacyPolicy: {
        id: 'privacyPolicy',
        defaultMessage: 'Privacy Policy',
    },
    termsOfService: {
        id: 'termsOfService',
        defaultMessage: 'Terms of Service',
    },
});
