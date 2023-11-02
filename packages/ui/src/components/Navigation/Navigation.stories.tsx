/* eslint-disable @typescript-eslint/naming-convention */

import type { Category, NewsroomLanguageSettings } from '@prezly/sdk';
import type { Meta, StoryFn } from '@storybook/react';

import { Navigation } from './Navigation';

export default {
    title: 'Components/Navigation',
    component: Navigation,
    parameters: { layout: 'fullscreen' },
} as Meta<typeof Navigation>;

const NavigationTemplate: StoryFn<typeof Navigation> = (args) => <Navigation {...args} />;

export const Default = NavigationTemplate.bind({});
Default.args = {
    categories: [
        {
            id: 4880,
            display_name: 'Environment',
            display_description: '',
            stories_number: 5,
            public_stories_number: 5,
            i18n: {
                en: {
                    locale: {
                        code: 'en',
                        locale: 'en',
                        name: 'English (Global)',
                        native_name: 'English (Global)',
                        direction: 'ltr',
                        language_code: 'en',
                    },
                    name: 'Environment',
                    description: '',
                    slug: 'environment',
                },
                en_GB: {
                    locale: {
                        code: 'en_GB',
                        locale: 'en_GB',
                        name: 'English (United Kingdom)',
                        native_name: 'English (United Kingdom)',
                        direction: 'ltr',
                        language_code: 'en',
                    },
                    name: 'Environment',
                    description: '',
                    slug: 'environment',
                },
            },
        },
        {
            id: 4876,
            display_name: 'Food',
            display_description: '',
            stories_number: 5,
            public_stories_number: 5,
            i18n: {
                en: {
                    locale: {
                        code: 'en',
                        locale: 'en',
                        name: 'English (Global)',
                        native_name: 'English (Global)',
                        direction: 'ltr',
                        language_code: 'en',
                    },
                    name: 'Food',
                    description: '',
                    slug: 'food',
                },
                en_GB: {
                    locale: {
                        code: 'en_GB',
                        locale: 'en_GB',
                        name: 'English (United Kingdom)',
                        native_name: 'English (United Kingdom)',
                        direction: 'ltr',
                        language_code: 'en',
                    },
                    name: 'Food',
                    description: '',
                    slug: 'food',
                },
                nl_BE: {
                    locale: {
                        code: 'nl_BE',
                        locale: 'nl_BE',
                        name: 'Dutch (Belgium)',
                        native_name: 'Nederlands (België)',
                        direction: 'ltr',
                        language_code: 'nl',
                    },
                    name: 'Eten',
                    description: '',
                    slug: 'eten',
                },
            },
        },
        {
            id: 5986,
            display_name: 'Technology',
            display_description:
                "Scientific breakthroughs that show the future isn't all doom and Skynet.",
            stories_number: 3,
            public_stories_number: 3,
            i18n: {
                en: {
                    locale: {
                        code: 'en',
                        locale: 'en',
                        name: 'English (Global)',
                        native_name: 'English (Global)',
                        direction: 'ltr',
                        language_code: 'en',
                    },
                    name: 'Technology',
                    description:
                        "Scientific breakthroughs that show the future isn't all doom and Skynet.",
                    slug: 'technology',
                },
                nl_BE: {
                    locale: {
                        code: 'nl_BE',
                        locale: 'nl_BE',
                        name: 'Dutch (Belgium)',
                        native_name: 'Nederlands (België)',
                        direction: 'ltr',
                        language_code: 'nl',
                    },
                    name: 'Technologie',
                    description:
                        'Wetenschappelijke doorbraken die de toekomst laten zien is niet alleen maar onheil en Skynet.',
                    slug: 'technologie',
                },
            },
        },
        {
            id: 5987,
            display_name: 'Art',
            display_description: 'Developments from the global art scene.',
            stories_number: 2,
            public_stories_number: 2,
            i18n: {
                en: {
                    locale: {
                        code: 'en',
                        locale: 'en',
                        name: 'English (Global)',
                        native_name: 'English (Global)',
                        direction: 'ltr',
                        language_code: 'en',
                    },
                    name: 'Art',
                    description: 'Developments from the global art scene.',
                    slug: 'art',
                },
                nl_BE: {
                    locale: {
                        code: 'nl_BE',
                        locale: 'nl_BE',
                        name: 'Dutch (Belgium)',
                        native_name: 'Nederlands (België)',
                        direction: 'ltr',
                        language_code: 'nl',
                    },
                    name: 'Kunst',
                    description: '',
                    slug: 'kunst',
                },
            },
        },
        {
            id: 6602,
            display_name: 'Games',
            display_description: '',
            stories_number: 1,
            public_stories_number: 1,
            i18n: {
                en: {
                    locale: {
                        code: 'en',
                        locale: 'en',
                        name: 'English (Global)',
                        native_name: 'English (Global)',
                        direction: 'ltr',
                        language_code: 'en',
                    },
                    name: 'Games',
                    description: '',
                    slug: 'games',
                },
            },
        },
        {
            id: 6603,
            display_name: 'Animals',
            display_description: '',
            stories_number: 1,
            public_stories_number: 1,
            i18n: {
                en: {
                    locale: {
                        code: 'en',
                        locale: 'en',
                        name: 'English (Global)',
                        native_name: 'English (Global)',
                        direction: 'ltr',
                        language_code: 'en',
                    },
                    name: 'Animals',
                    description: '',
                    slug: 'animals',
                },
            },
        },
        {
            id: 6604,
            display_name: 'Sports',
            display_description: '',
            stories_number: 1,
            public_stories_number: 1,
            i18n: {
                en: {
                    locale: {
                        code: 'en',
                        locale: 'en',
                        name: 'English (Global)',
                        native_name: 'English (Global)',
                        direction: 'ltr',
                        language_code: 'en',
                    },
                    name: 'Sports',
                    description: '',
                    slug: 'sports',
                },
            },
        },
        {
            id: 6605,
            display_name: 'Other',
            display_description: '',
            stories_number: 1,
            public_stories_number: 1,
            i18n: {
                en: {
                    locale: {
                        code: 'en',
                        locale: 'en',
                        name: 'English (Global)',
                        native_name: 'English (Global)',
                        direction: 'ltr',
                        language_code: 'en',
                    },
                    name: 'Other',
                    description: '',
                    slug: 'other',
                },
            },
        },
        {
            id: 6606,
            display_name: 'Family',
            display_description: '',
            stories_number: 1,
            public_stories_number: 1,
            i18n: {
                en: {
                    locale: {
                        code: 'en',
                        locale: 'en',
                        name: 'English (Global)',
                        native_name: 'English (Global)',
                        direction: 'ltr',
                        language_code: 'en',
                    },
                    name: 'Family',
                    description: '',
                    slug: 'family',
                },
            },
        },
    ] as Category[],
    languages: [
        {
            code: 'ar',
            locale: {
                code: 'ar',
                locale: 'ar',
                name: 'Arabic (Global)',
                native_name: 'العربية (عالمي)',
                direction: 'rtl',
                language_code: 'ar',
            },
            is_default: false,
            stories_count: 1,
            public_stories_count: 1,
            categories_count: 0,
            default_email_disclaimer:
                "<p>لقد تلقيت هذه الرسالة الإلكترونية لأنك طرف اتصال لـ%companyname%. إذا لم تعد ترغب في تلقي هذه الرسائل الإلكترونية، يُرجى <a href='%unsubscribe_url%'> إلغاء الاشتراك </a>.</p>",
            default_cookie_statement:
                '<p>نحن نستخدم ملفات تعريف الارتباط في موقعنا الإلكتروني، فهي تساعدنا على التعرف عليك قليلاً وعلى كيفية استخدامك لموقعنا الإلكتروني. يساعدنا هذا في إمدادك أنت والآخرين بتجربة ثرية ومخصصة.</p>',
            default_subscribe_disclaimer:
                '<p>من خلال تأكيد اشتراكك، فأنت تؤكد على فهم أنك تقوم بالتسجيل لتلقي محتوى والموافقة على معالجة معلوماتك وتخزينها بأمان.</p>',
            company_information: {
                name: 'The Good News Room',
                about: '',
                about_plaintext: '',
                email: null,
                website: null,
                phone: null,
                address: null,
                twitter: null,
                facebook: null,
                linkedin: null,
                pinterest: null,
                youtube: null,
                instagram: null,
                tiktok: null,
                discord: null,
                skype: null,
                snapchat: null,
                twitch: null,
                email_disclaimer: '',
                cookie_statement: '',
                subscribe_disclaimer: '',
                seo_settings: {
                    default_meta_title: 'The Good News Room',
                    default_meta_description: null,
                    meta_title: null,
                    meta_description: null,
                    canonical_url: null,
                },
            },
            notifications: [],
        },
        {
            code: 'ar_BH',
            locale: {
                code: 'ar_BH',
                locale: 'ar_BH',
                name: 'Arabic (Bahrain)',
                native_name: 'العربية (البحرين)',
                direction: 'rtl',
                language_code: 'ar',
            },
            is_default: false,
            stories_count: 1,
            public_stories_count: 1,
            categories_count: 0,
            default_email_disclaimer:
                "<p>لقد تلقيت هذه الرسالة الإلكترونية لأنك طرف اتصال لـ%companyname%. إذا لم تعد ترغب في تلقي هذه الرسائل الإلكترونية، يُرجى <a href='%unsubscribe_url%'> إلغاء الاشتراك </a>.</p>",
            default_cookie_statement:
                '<p>نحن نستخدم ملفات تعريف الارتباط في موقعنا الإلكتروني، فهي تساعدنا على التعرف عليك قليلاً وعلى كيفية استخدامك لموقعنا الإلكتروني. يساعدنا هذا في إمدادك أنت والآخرين بتجربة ثرية ومخصصة.</p>',
            default_subscribe_disclaimer:
                '<p>من خلال تأكيد اشتراكك، فأنت تؤكد على فهم أنك تقوم بالتسجيل لتلقي محتوى والموافقة على معالجة معلوماتك وتخزينها بأمان.</p>',
            company_information: {
                name: 'The Good News Room',
                about: '',
                about_plaintext: '',
                email: null,
                website: null,
                phone: null,
                address: null,
                twitter: null,
                facebook: null,
                linkedin: null,
                pinterest: null,
                youtube: null,
                instagram: null,
                tiktok: null,
                discord: null,
                skype: null,
                snapchat: null,
                twitch: null,
                email_disclaimer: '',
                cookie_statement: '',
                subscribe_disclaimer: '',
                seo_settings: {
                    default_meta_title: 'The Good News Room',
                    default_meta_description: null,
                    meta_title: null,
                    meta_description: null,
                    canonical_url: null,
                },
            },
            notifications: [],
        },
        {
            code: 'ar_QA',
            locale: {
                code: 'ar_QA',
                locale: 'ar_QA',
                name: 'Arabic (Qatar)',
                native_name: 'العربية (قطر)',
                direction: 'rtl',
                language_code: 'ar',
            },
            is_default: false,
            stories_count: 1,
            public_stories_count: 1,
            categories_count: 0,
            default_email_disclaimer:
                "<p>لقد تلقيت هذه الرسالة الإلكترونية لأنك طرف اتصال لـ%companyname%. إذا لم تعد ترغب في تلقي هذه الرسائل الإلكترونية، يُرجى <a href='%unsubscribe_url%'> إلغاء الاشتراك </a>.</p>",
            default_cookie_statement:
                '<p>نحن نستخدم ملفات تعريف الارتباط في موقعنا الإلكتروني، فهي تساعدنا على التعرف عليك قليلاً وعلى كيفية استخدامك لموقعنا الإلكتروني. يساعدنا هذا في إمدادك أنت والآخرين بتجربة ثرية ومخصصة.</p>',
            default_subscribe_disclaimer:
                '<p>من خلال تأكيد اشتراكك، فأنت تؤكد على فهم أنك تقوم بالتسجيل لتلقي محتوى والموافقة على معالجة معلوماتك وتخزينها بأمان.</p>',
            company_information: {
                name: 'The Good News Room',
                about: '',
                about_plaintext: '',
                email: null,
                website: null,
                phone: null,
                address: null,
                twitter: null,
                facebook: null,
                linkedin: null,
                pinterest: null,
                youtube: null,
                instagram: null,
                tiktok: null,
                discord: null,
                skype: null,
                snapchat: null,
                twitch: null,
                email_disclaimer: '',
                cookie_statement: '',
                subscribe_disclaimer: '',
                seo_settings: {
                    default_meta_title: 'The Good News Room',
                    default_meta_description: null,
                    meta_title: null,
                    meta_description: null,
                    canonical_url: null,
                },
            },
            notifications: [],
        },
        {
            code: 'nl_BE',
            locale: {
                code: 'nl_BE',
                locale: 'nl_BE',
                name: 'Dutch (Belgium)',
                native_name: 'Nederlands (België)',
                direction: 'ltr',
                language_code: 'nl',
            },
            is_default: false,
            stories_count: 4,
            public_stories_count: 3,
            categories_count: 3,
            default_email_disclaimer:
                "<p>U heeft deze e-mail ontvangen, omdat u een contact van %companyname% bent. Als u deze e-mails niet meer wenst te ontvangen, kunt u zich <a href='%unsubscribe_url%'>uitschrijven</a>.</p>",
            default_cookie_statement:
                '<p>We maken gebruik van cookies op onze website. Deze helpen ons om u iets beter te leren kennen en te zien hoe u onze website gebruikt. Dit helpt ons een waardevollere en op maat gemaakte ervaring te bieden voor u en anderen.</p>',
            default_subscribe_disclaimer:
                '<p>Door uw abonnement te bevestigen, bevestigt u dat u begrijpt dat u zich registreert om materiaal te ontvangen en dat uw gegevens veilig worden verwerkt en opgeslagen.</p>',
            company_information: {
                name: 'The Good News Room',
                about: '<p>Er is veel slecht nieuws in de wereld. Wij wilden een moment nemen om te focussen op de goeie dingen in het leven, want zelfs in de donkerste nacht zijn er sterren. ✨</p><p>Heb je zelf een leuk, positief verhaal? Vertel het ons! </p>',
                about_plaintext:
                    'Er is veel slecht nieuws in de wereld. Wij wilden een moment nemen om te focussen op de goeie dingen in het leven, want zelfs in de donkerste nacht zijn er sterren. ✨Heb je zelf een leuk, positief verhaal? Vertel het ons! ',
                email: 'happy@prezly.com',
                website: 'https://www.prezly.com/',
                phone: null,
                address: 'Tiensevest 100\n3000 Leuven\nBelgium',
                twitter: 'prezly',
                facebook: 'PrezlyPR',
                linkedin: 'https://www.linkedin.com/company/prezly',
                pinterest: null,
                youtube: null,
                instagram: 'prezly.official',
                tiktok: null,
                discord: null,
                skype: null,
                snapchat: null,
                twitch: null,
                email_disclaimer:
                    '<p>U heeft deze e-mail ontvangen, omdat u een contact van %companyname% bent. Als u deze e-mails niet meer wenst te ontvangen, kunt u zich <a href="%unsubscribe_url%">uitschrijven</a>.</p>',
                cookie_statement:
                    '<p>We maken gebruik van cookies op onze website. Deze helpen ons om u iets beter te leren kennen en te zien hoe u onze website gebruikt. <br>Dit helpt ons een waardevollere en op maat gemaakte ervaring te bieden voor u en anderen.</p>',
                subscribe_disclaimer:
                    '<p>Door uw abonnement te bevestigen, bevestigt u dat u begrijpt dat u zich registreert om materiaal te ontvangen en dat uw gegevens veilig worden verwerkt en opgeslagen.</p>',
                seo_settings: {
                    default_meta_title: 'The Good News Room',
                    default_meta_description:
                        'Er is veel slecht nieuws in de wereld. Wij wilden een moment nemen om te focussen op de goeie dingen in het leven, want zelfs in de donkerste...',
                    meta_title: null,
                    meta_description: null,
                    canonical_url: null,
                },
            },
            notifications: [],
        },
        {
            code: 'en',
            locale: {
                code: 'en',
                locale: 'en',
                name: 'English (Global)',
                native_name: 'English (Global)',
                direction: 'ltr',
                language_code: 'en',
            },
            is_default: true,
            stories_count: 23,
            public_stories_count: 21,
            categories_count: 9,
            default_email_disclaimer:
                "<p>You have received this email because you are a contact of %companyname%. If you no longer wish to receive these emails please <a href='%unsubscribe_url%'>unsubscribe</a>.</p>",
            default_cookie_statement:
                '<p>We use cookies on our website. They help us get to know you a little and how you use our website. This helps us provide a more valuable and tailored experience for you and others.</p>',
            default_subscribe_disclaimer:
                '<p>By confirming your subscription you are confirming you understand that you are registering to receive content and consent to your information being securely processed and stored.</p>',
            company_information: {
                name: 'The Good News Room',
                about: '<p>There\'s a lot of bad news in the world, so we wanted to take a moment to focus on the <a href="https://the-good-news-room.prezly.com/">good things</a> in life, because even in the darkest night there are stars. ✨<br /></p>\n<p>Have a nice story to recommend? Drop us a line!</p>',
                about_plaintext:
                    "There's a lot of bad news in the world, so we wanted to take a moment to focus on the good things in life, because even in the darkest night there are stars. ✨Have a nice story to recommend? Drop us a line!",
                email: 'happy@prezly.com',
                website: 'https://www.prezly.com/',
                phone: '+32 2 808 26 19',
                address: 'Tiensevest 100\n3000 Leuven\nBelgium',
                twitter: 'prezly',
                facebook: 'PrezlyPR',
                linkedin: 'https://www.linkedin.com/company/prezly',
                pinterest: 'https://pin.it/3Sk1TYD',
                youtube: 'https://www.youtube.com/channel/UCO2x-p9gg9TLKneXlibGR7w',
                instagram: 'prezly.official',
                tiktok: null,
                discord: null,
                skype: null,
                snapchat: null,
                twitch: null,
                email_disclaimer:
                    '<p>You have received this email because you are a contact of %companyname%. If you no longer wish to receive these emails please <a href="%unsubscribe_url%">unsubscribe</a>.</p>',
                cookie_statement:
                    '<p>We use cookies on our website. They help us get to know you a little and how you use our website. This helps us provide a more valuable and tailored experience for you and others.</p>',
                subscribe_disclaimer:
                    '<p>By confirming your subscription you are confirming you understand that you are registering to receive content and consent to your information being securely processed and stored.</p>',
                seo_settings: {
                    default_meta_title: 'The Good News Room',
                    default_meta_description:
                        "There's a lot of bad news in the world, so we wanted to take a moment to focus on the good things in life, because even in the darkest night there...",
                    meta_title: null,
                    meta_description: null,
                    canonical_url: null,
                },
            },
            notifications: [],
        },
        {
            code: 'en_NZ',
            locale: {
                code: 'en_NZ',
                locale: 'en_NZ',
                name: 'English (New Zealand)',
                native_name: 'English (New Zealand)',
                direction: 'ltr',
                language_code: 'en',
            },
            is_default: false,
            stories_count: 1,
            public_stories_count: 1,
            categories_count: 0,
            default_email_disclaimer:
                "<p>You have received this email because you are a contact of %companyname%. If you no longer wish to receive these emails please <a href='%unsubscribe_url%'>unsubscribe</a>.</p>",
            default_cookie_statement:
                '<p>We use cookies on our website. They help us get to know you a little and how you use our website. This helps us provide a more valuable and tailored experience for you and others.</p>',
            default_subscribe_disclaimer:
                '<p>By confirming your subscription you are confirming you understand that you are registering to receive content and consent to your information being securely processed and stored.</p>',
            company_information: {
                name: 'The Good News Room',
                about: '',
                about_plaintext: '',
                email: null,
                website: null,
                phone: null,
                address: null,
                twitter: null,
                facebook: null,
                linkedin: null,
                pinterest: null,
                youtube: null,
                instagram: null,
                tiktok: null,
                email_disclaimer: '',
                cookie_statement: '',
                subscribe_disclaimer: '',
                seo_settings: {
                    default_meta_title: 'The Good News Room',
                    default_meta_description: null,
                    meta_title: null,
                    meta_description: null,
                    canonical_url: null,
                },
            },
            notifications: [],
        },
        {
            code: 'en_PK',
            locale: {
                code: 'en_PK',
                locale: 'en_PK',
                name: 'English (Pakistan)',
                native_name: 'English (Pakistan)',
                direction: 'ltr',
                language_code: 'en',
            },
            is_default: false,
            stories_count: 0,
            public_stories_count: 0,
            categories_count: 0,
            default_email_disclaimer:
                "<p>You have received this email because you are a contact of %companyname%. If you no longer wish to receive these emails please <a href='%unsubscribe_url%'>unsubscribe</a>.</p>",
            default_cookie_statement:
                '<p>We use cookies on our website. They help us get to know you a little and how you use our website. This helps us provide a more valuable and tailored experience for you and others.</p>',
            default_subscribe_disclaimer:
                '<p>By confirming your subscription you are confirming you understand that you are registering to receive content and consent to your information being securely processed and stored.</p>',
            company_information: {
                name: 'The Good News Room',
                about: '',
                about_plaintext: '',
                email: null,
                website: null,
                phone: null,
                address: null,
                twitter: null,
                facebook: null,
                linkedin: null,
                pinterest: null,
                youtube: null,
                instagram: null,
                tiktok: null,
                skype: null,
                snapchat: null,
                twitch: null,
                email_disclaimer: '',
                cookie_statement: '',
                subscribe_disclaimer: '',
                seo_settings: {
                    default_meta_title: 'The Good News Room',
                    default_meta_description: null,
                    meta_title: null,
                    meta_description: null,
                    canonical_url: null,
                },
            },
            notifications: [],
        },
        {
            code: 'en_PH',
            locale: {
                code: 'en_PH',
                locale: 'en_PH',
                name: 'English (Philippines)',
                native_name: 'English (Philippines)',
                direction: 'ltr',
                language_code: 'en',
            },
            is_default: false,
            stories_count: 1,
            public_stories_count: 1,
            categories_count: 0,
            default_email_disclaimer:
                "<p>You have received this email because you are a contact of %companyname%. If you no longer wish to receive these emails please <a href='%unsubscribe_url%'>unsubscribe</a>.</p>",
            default_cookie_statement:
                '<p>We use cookies on our website. They help us get to know you a little and how you use our website. This helps us provide a more valuable and tailored experience for you and others.</p>',
            default_subscribe_disclaimer:
                '<p>By confirming your subscription you are confirming you understand that you are registering to receive content and consent to your information being securely processed and stored.</p>',
            company_information: {
                name: 'The Good News Room',
                about: '',
                about_plaintext: '',
                email: null,
                website: null,
                phone: null,
                address: null,
                twitter: null,
                facebook: null,
                linkedin: null,
                pinterest: null,
                youtube: null,
                instagram: null,
                tiktok: null,
                skype: null,
                snapchat: null,
                twitch: null,
                email_disclaimer: '',
                cookie_statement: '',
                subscribe_disclaimer: '',
                seo_settings: {
                    default_meta_title: 'The Good News Room',
                    default_meta_description: null,
                    meta_title: null,
                    meta_description: null,
                    canonical_url: null,
                },
            },
            notifications: [],
        },
        {
            code: 'en_QA',
            locale: {
                code: 'en_QA',
                locale: 'en_QA',
                name: 'English (Qatar)',
                native_name: 'English (Qatar)',
                direction: 'ltr',
                language_code: 'en',
            },
            is_default: false,
            stories_count: 0,
            public_stories_count: 0,
            categories_count: 0,
            default_email_disclaimer:
                "<p>You have received this email because you are a contact of %companyname%. If you no longer wish to receive these emails please <a href='%unsubscribe_url%'>unsubscribe</a>.</p>",
            default_cookie_statement:
                '<p>We use cookies on our website. They help us get to know you a little and how you use our website. This helps us provide a more valuable and tailored experience for you and others.</p>',
            default_subscribe_disclaimer:
                '<p>By confirming your subscription you are confirming you understand that you are registering to receive content and consent to your information being securely processed and stored.</p>',
            company_information: {
                name: 'The Good News Room',
                about: '',
                about_plaintext: '',
                email: null,
                website: null,
                phone: null,
                address: null,
                twitter: null,
                facebook: null,
                linkedin: null,
                pinterest: null,
                youtube: null,
                instagram: null,
                tiktok: null,
                skype: null,
                snapchat: null,
                twitch: null,
                email_disclaimer: '',
                cookie_statement: '',
                subscribe_disclaimer: '',
                seo_settings: {
                    default_meta_title: 'The Good News Room',
                    default_meta_description: null,
                    meta_title: null,
                    meta_description: null,
                    canonical_url: null,
                },
            },
            notifications: [],
        },
        {
            code: 'el_GR',
            locale: {
                code: 'el_GR',
                locale: 'el_GR',
                name: 'Greek',
                native_name: 'Ελληνικά',
                direction: 'ltr',
                language_code: 'el',
            },
            is_default: false,
            stories_count: 1,
            public_stories_count: 1,
            categories_count: 0,
            default_email_disclaimer:
                "<p>Έχετε λάβει αυτό το email επειδή είστε μία από τις επαφές της εταιρείας %companyname%. Αν δεν επιθυμείτε πλέον να λαμβάνετε αυτά τα email, παρακαλούμε <a href='%unsubscribe_url%'>καταργήστε την εγγραφή</a>.</p>",
            default_cookie_statement:
                '<p>Χρησιμοποιούμε cookies στην ιστοσελίδα μας. Μας βοηθούν να σας γνωρίσουμε και πώς χρησιμοποιείτε την ιστοσελίδα μας. Μπορούμε έτσι να παρέχουμε πιο αξιόλογο περιεχόμενο και εμπειρία προσαρμοσμένη στα μέτρα σας.</p>',
            default_subscribe_disclaimer:
                '<p>Επιβεβαιώνοντας τη συνδρομή σας επιβεβαιώνετε επίσης πως κατανοείτε ότι πραγματοποιείτε εγγραφή για να λαμβάνετε περιεχόμενο και ότι δίνετε τη συγκατάθεσή σας οι πληροφορίες σας να τύχουν ασφαλούς επεξεργασίας και να αποθηκευτούν.</p>',
            company_information: {
                name: 'The Good News Room',
                about: '',
                about_plaintext: '',
                email: null,
                website: null,
                phone: null,
                address: null,
                twitter: null,
                facebook: null,
                linkedin: null,
                pinterest: null,
                youtube: null,
                instagram: null,
                tiktok: null,
                skype: null,
                snapchat: null,
                twitch: null,
                email_disclaimer: '',
                cookie_statement: '',
                subscribe_disclaimer: '',
                seo_settings: {
                    default_meta_title: 'The Good News Room',
                    default_meta_description: null,
                    meta_title: null,
                    meta_description: null,
                    canonical_url: null,
                },
            },
            notifications: [],
        },
        {
            code: 'hu_HU',
            locale: {
                code: 'hu_HU',
                locale: 'hu_HU',
                name: 'Hungarian',
                native_name: 'Magyar',
                direction: 'ltr',
                language_code: 'hu',
            },
            is_default: false,
            stories_count: 0,
            public_stories_count: 0,
            categories_count: 0,
            default_email_disclaimer:
                "<p>Azért kapta ezt az e-mailt, mert %companyname% kapcsolatai között szerepel. Ha nem szeretne több ilyen e-mailt kapni, kérem <a href='%unsubscribe_url%'>iratkozzon le</a>.</p>",
            default_cookie_statement:
                '<p>A weboldalunkon cookie-kat használunk. Segítenek nekünk egy kicsit jobban megismerni önt, és azt, hogyan használja a honlapunkat. Ez segít nekünk értékesebb és személyre szabott élményt nyújtani önnek és másoknak.</p>',
            default_subscribe_disclaimer:
                '<p>A feliratkozás jóváhagyásával megerősíti azt, hogy megérti, hogy a tartalom fogadására regisztrált és hozzájárul az adatai biztonságos feldolgozásához és tárolásához.</p>',
            company_information: {
                name: 'The Good News Room',
                about: '',
                about_plaintext: '',
                email: null,
                website: null,
                phone: null,
                address: null,
                twitter: null,
                facebook: null,
                linkedin: null,
                pinterest: null,
                youtube: null,
                instagram: null,
                tiktok: null,
                skype: null,
                snapchat: null,
                twitch: null,
                email_disclaimer: '',
                cookie_statement: '',
                subscribe_disclaimer: '',
                seo_settings: {
                    default_meta_title: 'The Good News Room',
                    default_meta_description: null,
                    meta_title: null,
                    meta_description: null,
                    canonical_url: null,
                },
            },
            notifications: [],
        },
    ] as NewsroomLanguageSettings[],
    publicGalleriesCount: 1,
    siteName: 'Test site',
    externalSiteLink: 'https://hey.test-site.com/testing-1-2-3',
    layout: 'centered',
    logo: {
        version: 2,
        uuid: '13b5794c-619e-4c6f-961c-0b8e15d771c9',
        filename: 'goodnewsroom-new.png',
        mime_type: 'image/png',
        size: 21659,
        original_width: 916,
        original_height: 331,
        effects: [],
    },
    onSearch: () => {},
    hasStandaloneAboutPage: true,
    hasStandaloneContactsPage: true,
    locale: 'en',
};
