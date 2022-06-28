/* eslint-disable @typescript-eslint/naming-convention */
import { type NewsroomLanguageSettings, TextDirection } from '@prezly/sdk';

/**
 * Pulled from The Good Newsroom (with some additions)
 */
export const LANGUAGES: Record<string, NewsroomLanguageSettings> = {
    nl_BE: {
        code: 'nl_BE',
        locale: {
            code: 'nl_BE',
            locale: 'nl_BE',
            name: 'Dutch (Belgium)',
            native_name: 'Nederlands (België)',
            direction: TextDirection.LTR,
            language_code: 'nl',
        },
        is_default: false,
        stories_count: 4,
        public_stories_count: 3,
        categories_count: 2,
        default_email_disclaimer:
            "<p>U heeft deze e-mail ontvangen, omdat u een contact van %companyname% bent. Als u deze e-mails niet meer wenst te ontvangen, kunt u zich <a href='%unsubscribe_url%'>uitschrijven</a>.</p>",
        default_cookie_statement:
            '<p>We maken gebruik van cookies op onze website. Deze helpen ons om u iets beter te leren kennen en te zien hoe u onze website gebruikt. Dit helpt ons een waardevollere en op maat gemaakte ervaring te bieden voor u en anderen.</p>',
        default_subscribe_disclaimer:
            '<p>Door uw abonnement te bevestigen, bevestigt u dat u begrijpt dat u zich registreert om materiaal te ontvangen en dat uw gegevens veilig worden verwerkt en opgeslagen.</p>',
        company_information: {
            name: 'The Good News Room',
            about: '<p>Er is veel slecht nieuws in de wereld. Wij wilden een moment nemen om te focussen op de goeie dingen in het leven, want zelfs in de donkerste nacht zijn er sterren. ✨<br />Heb je zelf een leuk, positief verhaal? Vertel het ons! ☺︎</p>',
            about_plaintext:
                'Er is veel slecht nieuws in de wereld. Wij wilden een moment nemen om te focussen op de goeie dingen in het leven, want zelfs in de donkerste nacht zijn er sterren. ✨Heb je zelf een leuk, positief verhaal? Vertel het ons! ☺︎',
            email: 'happy@prezly.com',
            website: 'https://www.prezly.com/',
            phone: null,
            address: null,
            twitter: 'prezly',
            facebook: 'PrezlyPR',
            linkedin: 'https://www.linkedin.com/company/prezly',
            pinterest: null,
            youtube: null,
            instagram: 'prezly.official',
            tiktok: null,
            email_disclaimer:
                '<p>U heeft deze e-mail ontvangen, omdat u een contact van %companyname% bent. Als u deze e-mails niet meer wenst te ontvangen, kunt u zich <a href="%unsubscribe_url%">uitschrijven</a>.</p>',
            cookie_statement:
                '<p>We maken gebruik van cookies op onze website. Deze helpen ons om u iets beter te leren kennen en te zien hoe u onze website gebruikt. <br>Dit helpt ons een waardevollere en op maat gemaakte ervaring te bieden voor u en anderen.</p>',
            subscribe_disclaimer:
                '<p>Door uw abonnement te bevestigen, bevestigt u dat u begrijpt dat u zich registreert om materiaal te ontvangen en dat uw gegevens veilig worden verwerkt en opgeslagen.</p>',
        },
    },
    nl_NL: {
        code: 'nl_NL',
        locale: {
            code: 'nl_NL',
            locale: 'nl_NL',
            name: 'Dutch (Netherlands)',
            native_name: 'Nederlands (Nederland)',
            direction: TextDirection.LTR,
            language_code: 'nl',
        },
        is_default: false,
        stories_count: 1,
        public_stories_count: 1,
        categories_count: 0,
        default_email_disclaimer:
            "<p>U heeft deze e-mail ontvangen, omdat u een contact van %companyname% bent. Als u deze e-mails niet meer wenst te ontvangen, kunt u zich <a href='%unsubscribe_url%'>uitschrijven</a>.</p>",
        default_cookie_statement:
            '<p>We maken gebruik van cookies op onze website. Deze helpen ons om u iets beter te leren kennen en te zien hoe u onze website gebruikt. Dit helpt ons een waardevollere en op maat gemaakte ervaring te bieden voor u en anderen.</p>',
        default_subscribe_disclaimer:
            '<p>Door uw abonnement te bevestigen, bevestigt u dat u begrijpt dat u zich registreert om materiaal te ontvangen en dat uw gegevens veilig worden verwerkt en opgeslagen.</p>',
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
        },
    },
    en: {
        code: 'en',
        locale: {
            code: 'en',
            locale: 'en',
            name: 'English (Global)',
            native_name: 'English (Global)',
            direction: TextDirection.LTR,
            language_code: 'en',
        },
        is_default: true,
        stories_count: 22,
        public_stories_count: 17,
        categories_count: 7,
        default_email_disclaimer:
            "<p>You have received this email because you are a contact of %companyname%. If you no longer wish to receive these emails please <a href='%unsubscribe_url%'>unsubscribe</a>.</p>",
        default_cookie_statement:
            '<p>We use cookies on our website. They help us get to know you a little and how you use our website. This helps us provide a more valuable and tailored experience for you and others.</p>',
        default_subscribe_disclaimer:
            '<p>By confirming your subscription you are confirming you understand that you are registering to receive content and consent to your information being securely processed and stored.</p>',
        company_information: {
            name: 'The Good News Room',
            about:
                `<p>There's a lot of bad news in the world, so we wanted to take a moment to focus on the <a href="https://the-good-news-room.prezly.com/">good things</a> in life, because even in the darkest night there are stars. ✨<br /></p>\n` +
                '<p>Have a nice story to recommend? Drop us a line! ☺︎</p>',
            about_plaintext:
                "There's a lot of bad news in the world, so we wanted to take a moment to focus on the good things in life, because even in the darkest night there are stars. ✨Have a nice story to recommend? Drop us a line! ☺︎",
            email: 'happy@prezly.com',
            website: 'https://www.prezly.com/',
            phone: '+1 987654321',
            address: 'Fake Street 123',
            twitter: 'prezly',
            facebook: 'PrezlyPR',
            linkedin: 'https://www.linkedin.com/company/prezly',
            pinterest: 'https://pin.it/3Sk1TYD',
            youtube: 'https://www.youtube.com/channel/UCO2x-p9gg9TLKneXlibGR7w',
            instagram: 'prezly.official',
            tiktok: null,
            email_disclaimer:
                '<p>You have received this email because you are a contact of %companyname%. If you no longer wish to receive these emails please <a href="%unsubscribe_url%">unsubscribe</a>.</p>',
            cookie_statement:
                '<p>We use cookies on our website. They help us get to know you a little and how you use our website. This helps us provide a more valuable and tailored experience for you and others.</p>',
            subscribe_disclaimer:
                '<p>By confirming your subscription you are confirming you understand that you are registering to receive content and consent to your information being securely processed and stored.</p>',
        },
    },
    en_US: {
        code: 'en_US',
        locale: {
            code: 'en_US',
            locale: 'en_US',
            name: 'English (US)',
            native_name: 'English (US)',
            direction: TextDirection.LTR,
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
            about:
                `<p>There's a lot of bad news in the world, so we wanted to take a moment to focus on the <a href="https://the-good-news-room.prezly.com/">good things</a> in life, because even in the darkest night there are stars. ✨<br /></p>\n` +
                '<p>Have a nice story to recommend? Drop us a line! ☺︎</p>',
            about_plaintext:
                "There's a lot of bad news in the world, so we wanted to take a moment to focus on the good things in life, because even in the darkest night there are stars. ✨Have a nice story to recommend? Drop us a line! ☺︎",
            email: 'happy@prezly.com',
            website: 'https://www.prezly.com/',
            phone: '+1 987654321',
            address: 'Fake Street 123',
            twitter: 'prezly',
            facebook: 'PrezlyPR',
            linkedin: 'https://www.linkedin.com/company/prezly',
            pinterest: 'https://pin.it/3Sk1TYD',
            youtube: 'https://www.youtube.com/channel/UCO2x-p9gg9TLKneXlibGR7w',
            instagram: 'prezly.official',
            tiktok: null,
            email_disclaimer:
                '<p>You have received this email because you are a contact of %companyname%. If you no longer wish to receive these emails please <a href="%unsubscribe_url%">unsubscribe</a>.</p>',
            cookie_statement:
                '<p>We use cookies on our website. They help us get to know you a little and how you use our website. This helps us provide a more valuable and tailored experience for you and others.</p>',
            subscribe_disclaimer:
                '<p>By confirming your subscription you are confirming you understand that you are registering to receive content and consent to your information being securely processed and stored.</p>',
        },
    },
    en_GB: {
        code: 'en_GB',
        locale: {
            code: 'en_GB',
            locale: 'en_GB',
            name: 'English (UK)',
            native_name: 'English (UK)',
            direction: TextDirection.LTR,
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
            about:
                `<p>There's a lot of bad news in the world, so we wanted to take a moment to focus on the <a href="https://the-good-news-room.prezly.com/">good things</a> in life, because even in the darkest night there are stars. ✨<br /></p>\n` +
                '<p>Have a nice story to recommend? Drop us a line! ☺︎</p>',
            about_plaintext:
                "There's a lot of bad news in the world, so we wanted to take a moment to focus on the good things in life, because even in the darkest night there are stars. ✨Have a nice story to recommend? Drop us a line! ☺︎",
            email: 'happy@prezly.com',
            website: 'https://www.prezly.com/',
            phone: '+1 987654321',
            address: 'Fake Street 123',
            twitter: 'prezly',
            facebook: 'PrezlyPR',
            linkedin: 'https://www.linkedin.com/company/prezly',
            pinterest: 'https://pin.it/3Sk1TYD',
            youtube: 'https://www.youtube.com/channel/UCO2x-p9gg9TLKneXlibGR7w',
            instagram: 'prezly.official',
            tiktok: null,
            email_disclaimer:
                '<p>You have received this email because you are a contact of %companyname%. If you no longer wish to receive these emails please <a href="%unsubscribe_url%">unsubscribe</a>.</p>',
            cookie_statement:
                '<p>We use cookies on our website. They help us get to know you a little and how you use our website. This helps us provide a more valuable and tailored experience for you and others.</p>',
            subscribe_disclaimer:
                '<p>By confirming your subscription you are confirming you understand that you are registering to receive content and consent to your information being securely processed and stored.</p>',
        },
    },
    fr: {
        code: 'fr',
        locale: {
            code: 'fr',
            locale: 'fr',
            name: 'French (Global)',
            native_name: 'Français (Mondial)',
            direction: TextDirection.LTR,
            language_code: 'fr',
        },
        is_default: false,
        stories_count: 0,
        public_stories_count: 0,
        categories_count: 0,
        default_email_disclaimer:
            "<p>Vous avez reçu cet e-mail car vous faites partie des contacts de %companyname%. Si vous ne souhaitez plus recevoir ces e-mails, veuillez vous <a href='%unsubscribe_url%'>désabonner</a>.</p>",
        default_cookie_statement:
            "<p>Nous utilisons des cookies sur notre site internet. Ils nous aident à en savoir un tout petit peu plus sur vous et sur votre façon d'utiliser notre site. Ainsi, il nous est possible de vous proposer, à vous comme à d'autres, une expérience plus riche et personnalisée.</p>",
        default_subscribe_disclaimer:
            '<p>En confirmant votre inscription, vous confirmez que vous comprenez que vous vous inscrivez pour recevoir du contenu, et consentez à ce que vos données personnelles soient traitées et stockées en toute sécurité.</p>',
        company_information: {
            name: 'The Good News Room',
            about:
                '<p>Il y a beaucoup de mauvaises nouvelles dans le monde, donc nous voulions prendre un moment pour nous concentrer sur les bonnes choses de la vie, car même dans la nuit la plus sombre, il y a des étoiles ✨ Vous avez une belle histoire à recommander? Écrivez-nous :)</p>\n' +
                '<p>Vous avez une seconde? <a href="https://prezly1.typeform.com/to/LE8hLK">Répondez a notre sondage</a> et courez la chance de gagner un iPhone 11 Pro!</p>',
            about_plaintext:
                'Il y a beaucoup de mauvaises nouvelles dans le monde, donc nous voulions prendre un moment pour nous concentrer sur les bonnes choses de la vie, car même dans la nuit la plus sombre, il y a des étoiles ✨ Vous avez une belle histoire à recommander? Écrivez-nous :)Vous avez une seconde? Répondez a notre sondage et courez la chance de gagner un iPhone 11 Pro!',
            email: 'happy@prezly.com',
            website: 'https://www.prezly.com/',
            phone: null,
            address: null,
            twitter: 'prezly',
            facebook: 'PrezlyPR',
            linkedin: 'https://www.linkedin.com/company/prezly',
            pinterest: null,
            youtube: null,
            instagram: 'prezly.official',
            tiktok: null,
            email_disclaimer:
                '<p>Vous avez reçu cet e-mail car vous faites partie des contacts de %companyname%. Si vous ne souhaitez plus recevoir ces e-mails, veuillez vous <a href="%unsubscribe_url%">désabonner</a>.</p>',
            cookie_statement:
                "<p>Nous utilisons des cookies sur notre site internet. Ils nous aident à en savoir un tout petit peu plus sur vous et sur votre façon d'utiliser notre site. Ainsi, il nous est possible de vous proposer, à vous comme à d'autres, une expérience plus riche et personnalisée.</p>",
            subscribe_disclaimer:
                '<p>En confirmant votre inscription, vous confirmez que vous comprenez que vous vous inscrivez pour recevoir du contenu, et consentez à ce que vos données personnelles soient traitées et stockées en toute sécurité.</p>',
        },
    },
    fr_BE: {
        code: 'fr_BE',
        locale: {
            code: 'fr_BE',
            locale: 'fr_BE',
            name: 'French (Belgium)',
            native_name: 'Français (België)',
            direction: TextDirection.LTR,
            language_code: 'fr',
        },
        is_default: false,
        stories_count: 0,
        public_stories_count: 0,
        categories_count: 0,
        default_email_disclaimer:
            "<p>Vous avez reçu cet e-mail car vous faites partie des contacts de %companyname%. Si vous ne souhaitez plus recevoir ces e-mails, veuillez vous <a href='%unsubscribe_url%'>désabonner</a>.</p>",
        default_cookie_statement:
            "<p>Nous utilisons des cookies sur notre site internet. Ils nous aident à en savoir un tout petit peu plus sur vous et sur votre façon d'utiliser notre site. Ainsi, il nous est possible de vous proposer, à vous comme à d'autres, une expérience plus riche et personnalisée.</p>",
        default_subscribe_disclaimer:
            '<p>En confirmant votre inscription, vous confirmez que vous comprenez que vous vous inscrivez pour recevoir du contenu, et consentez à ce que vos données personnelles soient traitées et stockées en toute sécurité.</p>',
        company_information: {
            name: 'The Good News Room',
            about:
                '<p>Il y a beaucoup de mauvaises nouvelles dans le monde, donc nous voulions prendre un moment pour nous concentrer sur les bonnes choses de la vie, car même dans la nuit la plus sombre, il y a des étoiles ✨ Vous avez une belle histoire à recommander? Écrivez-nous :)</p>\n' +
                '<p>Vous avez une seconde? <a href="https://prezly1.typeform.com/to/LE8hLK">Répondez a notre sondage</a> et courez la chance de gagner un iPhone 11 Pro!</p>',
            about_plaintext:
                'Il y a beaucoup de mauvaises nouvelles dans le monde, donc nous voulions prendre un moment pour nous concentrer sur les bonnes choses de la vie, car même dans la nuit la plus sombre, il y a des étoiles ✨ Vous avez une belle histoire à recommander? Écrivez-nous :)Vous avez une seconde? Répondez a notre sondage et courez la chance de gagner un iPhone 11 Pro!',
            email: 'happy@prezly.com',
            website: 'https://www.prezly.com/',
            phone: null,
            address: null,
            twitter: 'prezly',
            facebook: 'PrezlyPR',
            linkedin: 'https://www.linkedin.com/company/prezly',
            pinterest: null,
            youtube: null,
            instagram: 'prezly.official',
            tiktok: null,
            email_disclaimer:
                '<p>Vous avez reçu cet e-mail car vous faites partie des contacts de %companyname%. Si vous ne souhaitez plus recevoir ces e-mails, veuillez vous <a href="%unsubscribe_url%">désabonner</a>.</p>',
            cookie_statement:
                "<p>Nous utilisons des cookies sur notre site internet. Ils nous aident à en savoir un tout petit peu plus sur vous et sur votre façon d'utiliser notre site. Ainsi, il nous est possible de vous proposer, à vous comme à d'autres, une expérience plus riche et personnalisée.</p>",
            subscribe_disclaimer:
                '<p>En confirmant votre inscription, vous confirmez que vous comprenez que vous vous inscrivez pour recevoir du contenu, et consentez à ce que vos données personnelles soient traitées et stockées en toute sécurité.</p>',
        },
    },
    es_ES: {
        code: 'es_ES',
        locale: {
            code: 'es_ES',
            locale: 'es_ES',
            name: 'Spanish (Spain)',
            native_name: 'Español (España)',
            direction: TextDirection.LTR,
            language_code: 'es',
        },
        is_default: false,
        stories_count: 0,
        public_stories_count: 0,
        categories_count: 0,
        default_email_disclaimer:
            "<p>Ha recibido este correo electrónico porque usted es uno de los contactos de %companyname%. Si no quiere seguir recibiendo estos correos electrónicos, por favor, <a href='%unsubscribe_url%'>cancele la suscripción</a>.</p>",
        default_cookie_statement:
            '<p>Utilizamos cookies en nuestro sitio web. Nos ayudan a conocerle un poco y saber cómo usa nuestro sitio web, lo que nos sirve para proporcionarle a usted y a los demás una experiencia más valiosa y personalizada.</p>',
        default_subscribe_disclaimer:
            '<p>Al confirmar su suscripción, confirma que entiende que se está registrando para recibir contenido y accede a que su información se procese y guarde de manera segura.</p>',
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
            email_disclaimer:
                '<p>Ha recibido este correo electrónico porque usted es uno de los contactos de %companyname%. Si no quiere seguir recibiendo estos correos electrónicos, por favor, <a href="%unsubscribe_url%">cancele la suscripción</a>.</p>',
            cookie_statement:
                '<p>Utilizamos cookies en nuestro sitio web. Nos ayudan a conocerle un poco y saber cómo usa nuestro sitio web, lo que nos sirve para proporcionarle a usted y a los demás una experiencia más valiosa y personalizada.</p>',
            subscribe_disclaimer:
                '<p>Al confirmar su suscripción, confirma que entiende que se está registrando para recibir contenido y accede a que su información se procese y guarde de manera segura.</p>',
        },
    },
};
