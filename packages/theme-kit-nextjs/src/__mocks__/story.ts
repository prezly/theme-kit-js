import type { ExtendedStory } from '@prezly/sdk';
import { Culture, Newsroom, Story, User } from '@prezly/sdk';

export const STORY: ExtendedStory = {
    id: 380023,
    attached_gallery_content: null,
    is_pinned: false,
    is_shared_to_prpro: false,
    pinned_by: null,
    seo_settings: {
        canonical_url: null,
        default_meta_description: null,
        default_meta_title: null,
        meta_description: null,
        meta_title: null,
    },
    uuid: '65018f5b-b313-453f-b23b-9e739c6a8591',
    thumbnail_url:
        'https://avatars-cdn.prezly.com/story/6337/380023/c3a3d56ee09ce808dbb1bc2f06d16b68bdaeefbf731d8a080b7e4d5e68fb3e94?t=1640077510&v=1',
    title: 'Take a breath',
    subtitle:
        "Going through your socials, you'll likely come across some guru preaching that this quarantine is the ideal moment to pause your busy life and just chill. While it's up to you to decide what's best, few can argue that you shouldn't take every opportunity to stick your head out and suck in a lungful of that fresh(er) air.",
    intro: '',
    summary:
        "Air quality has been an important topic this millennium. There were those who didn't believe we had an impact on it, but these past weeks have proved otherwise.",
    culture: {
        code: 'en',
        locale: 'en',
        name: 'English (Global)',
        native_name: 'English (Global)',
        direction: Culture.TextDirection.LTR,
        language_code: 'en',
    },
    slug: 'take-a-breath',
    format_version: 3,
    language: 'EN',
    lifecycle_status: Story.LifecycleStatus.PUBLISHED,
    publication_status: Story.PublicationStatus.PUBLISHED,
    visibility: Story.Visibility.PUBLIC,
    is_archived: false,
    is_finalized: true,
    is_published: true,
    is_draft: false,
    is_embargo: false,
    is_private: false,
    is_scheduled: false,
    is_analytics_available: true,
    is_sharable: true,
    created_at: '2020-04-28T12:03:46+00:00',
    updated_at: '2021-12-21T09:05:10+00:00',
    published_at: '2020-04-30T12:56:00+00:00',
    scheduled_at: null,
    author: {
        id: 7680,
        username: 'marthe@prezly.com',
        email: 'marthe@prezly.com',
        display_name: 'Marthe Anthonis',
        first_name: 'Marthe',
        last_name: 'Anthonis',
        avatar_url:
            'https://avatars-cdn.prezly.com/user/7680/6260be53465a846a511c44edd8f594f38235d782f3fa515ab968ad2f947a236c?v=1&c=cc6e751bdb46638cd948d0d812149ce391e45b7cd2b5d80a94de575ba0ce65d0',
        use_case_answer: User.UseCaseAnswer.UNKNOWN,
        sign_in_flow: User.SignInFlow.PASSWORD,
        created_at: '2019-02-06T09:54:34+00:00',
        is_terms_of_service_accepted: false,
        last_seen_at: '2021-12-03T09:15:39+00:00',
        locked_until: null,
    },
    newsroom: {
        uuid: '578e78e9-9a5b-44ad-bda2-5214895ee036',
        id: 12698,
        name: 'The Good News Room',
        display_name: 'The Good News Room',
        subdomain: 'the-good-news-room',
        thumbnail_url:
            'https://avatars-cdn.prezly.com/newsroom/12698/e4939974b7781d4c61e282713116690387e9b7b1f6302478b13b68e18e0d3055?t=1648556918&v=1',
        timezone: 'europe/london',
        status: Newsroom.Status.ACTIVE,
        is_active: true,
        is_archived: false,
        is_online: true,
        is_offline: false,
        is_multilingual: true,
        is_indexable: true,
        url: 'https://the-good-news-room.prezly.com/',
        links: {
            media_gallery_api: 'https://api.prezly.com/v1/rooms/12698/media',
            analytics_and_visibility_settings:
                'https://rock.prezly.com/pressroom/the-good-news-room/ga',
            categories_management:
                'https://rock.prezly.com/settings/newsrooms/578e78e9-9a5b-44ad-bda2-5214895ee036/categories',
            company_info_settings:
                'https://rock.prezly.com/settings/newsrooms/578e78e9-9a5b-44ad-bda2-5214895ee036/information',
            contacts_management:
                'https://rock.prezly.com/settings/newsrooms/578e78e9-9a5b-44ad-bda2-5214895ee036/contacts',
            domain_settings: 'https://rock.prezly.com/pressroom/the-good-news-room/domain',
            edit: 'https://rock.prezly.com/settings/newsrooms/578e78e9-9a5b-44ad-bda2-5214895ee036/information',
            gallery_management: 'https://rock.prezly.com/pressroom/the-good-news-room/gallery',
            hub_settings: 'https://rock.prezly.com/pressroom/the-good-news-room/hub',
            languages:
                'https://rock.prezly.com/settings/newsrooms/578e78e9-9a5b-44ad-bda2-5214895ee036/languages',
            look_and_feel_settings:
                'https://rock.prezly.com/settings/newsrooms/578e78e9-9a5b-44ad-bda2-5214895ee036/themes',
            manual_subscription_management: '',
            privacy_settings:
                'https://rock.prezly.com/settings/newsrooms/578e78e9-9a5b-44ad-bda2-5214895ee036/privacy',
            widget_settings: 'https://rock.prezly.com/pressroom/the-good-news-room/widget',
        },
        time_format: 'HH:mm',
        date_format: 'D/M/YY',
    },
    oembed: {
        type: 'link',
        url: 'https://the-good-news-room.prezly.com/take-a-breath',
        title: 'Take a breath',
        description:
            "Going through your socials, you'll likely come across some guru preaching that this quarantine is the ideal moment to pause your busy life and just chill. While it's up to you to decide what's best, few can argue that you shouldn't take every opportunity to stick your head out and suck in a lungful of that fresh(er) air.",
        thumbnail_url:
            'https://cdn.uc.assets.prezly.com/e9dc3b29-3d91-46e4-b9a0-695f8517bbf0/-/preview/600x600/',
        thumbnail_width: 1024,
        thumbnail_height: 482,
        version: '1.0',
    },
    links: {
        api: 'https://api.prezly.com/v1/stories/380023',
        preview: '',
        edit: 'https://rock.prezly.com/stories/380023',
        sharing: 'https://rock.prezly.com/stories/380023/sharing',
        duplicate: 'https://rock.prezly.com/pressrelease/duplicate/380023',
        translate: 'https://rock.prezly.com/pressrelease/translate/380023',
        analytics: 'https://rock.prezly.com/stories/380023/report',
        publication_api: 'https://api.prezly.com/v1/stories/380023/publication',
        create_campaign: '',
        reports_api: 'https://api.prezly.com/v1/stories/380023/reports',
        short: 'http://prez.ly/zRAb',
        newsroom_view: 'https://the-good-news-room.prezly.com/take-a-breath',
        newsroom_preview:
            'https://the-good-news-room.prezly.com/s/65018f5b-b313-453f-b23b-9e739c6a8591',
    },
    categories: [],
    translations: [
        {
            id: 380028,
            uuid: 'db07a149-ce6a-4446-a86e-689440fae2ac',
            slug: 'adem',
            thumbnail_url:
                'https://avatars-cdn.prezly.com/story/6337/380028/6a9248cfbf88bbea5eb9ca1b3907a9bf163e4a41a34598ad38a3d1150c648b79?t=1640077505&v=1',
            title: 'Adem!',
            culture: {
                code: 'nl_BE',
                locale: 'nl_BE',
                name: 'Dutch (Belgium)',
                native_name: 'Nederlands (België)',
                direction: Culture.TextDirection.LTR,
                language_code: 'nl',
            },
            lifecycle_status: Story.LifecycleStatus.PUBLISHED,
            publication_status: Story.PublicationStatus.PUBLISHED,
            visibility: Story.Visibility.PUBLIC,
            created_at: '2020-05-05T10:07:11+00:00',
            updated_at: '2021-12-21T09:05:05+00:00',
            published_at: '2020-05-05T10:21:00+00:00',
            scheduled_at: null,
            author: {
                id: 7680,
                username: 'marthe@prezly.com',
                email: 'marthe@prezly.com',
                display_name: 'Marthe Anthonis',
                first_name: 'Marthe',
                last_name: 'Anthonis',
                avatar_url:
                    'https://avatars-cdn.prezly.com/user/7680/6260be53465a846a511c44edd8f594f38235d782f3fa515ab968ad2f947a236c?v=1&c=cc6e751bdb46638cd948d0d812149ce391e45b7cd2b5d80a94de575ba0ce65d0',
                use_case_answer: User.UseCaseAnswer.UNKNOWN,
                sign_in_flow: User.SignInFlow.PASSWORD,
                created_at: '2019-02-06T09:54:34+00:00',
                is_terms_of_service_accepted: false,
                last_seen_at: '2021-12-03T09:15:39+00:00',
                locked_until: null,
            },
            newsroom: {
                uuid: '578e78e9-9a5b-44ad-bda2-5214895ee036',
                id: 12698,
                name: 'The Good News Room',
                display_name: 'The Good News Room',
                subdomain: 'the-good-news-room',
                thumbnail_url:
                    'https://avatars-cdn.prezly.com/newsroom/12698/e4939974b7781d4c61e282713116690387e9b7b1f6302478b13b68e18e0d3055?t=1648556918&v=1',
                timezone: 'europe/london',
                status: Newsroom.Status.ACTIVE,
                is_active: true,
                is_archived: false,
                is_online: true,
                is_offline: false,
                is_multilingual: true,
                is_indexable: true,
                url: 'https://the-good-news-room.prezly.com/',
                links: {
                    media_gallery_api: 'https://api.prezly.com/v1/rooms/12698/media',
                    analytics_and_visibility_settings:
                        'https://rock.prezly.com/pressroom/the-good-news-room/ga',
                    categories_management:
                        'https://rock.prezly.com/settings/newsrooms/578e78e9-9a5b-44ad-bda2-5214895ee036/categories',
                    company_info_settings:
                        'https://rock.prezly.com/settings/newsrooms/578e78e9-9a5b-44ad-bda2-5214895ee036/information',
                    contacts_management:
                        'https://rock.prezly.com/settings/newsrooms/578e78e9-9a5b-44ad-bda2-5214895ee036/contacts',
                    domain_settings: 'https://rock.prezly.com/pressroom/the-good-news-room/domain',
                    edit: 'https://rock.prezly.com/settings/newsrooms/578e78e9-9a5b-44ad-bda2-5214895ee036/information',
                    gallery_management:
                        'https://rock.prezly.com/pressroom/the-good-news-room/gallery',
                    hub_settings: 'https://rock.prezly.com/pressroom/the-good-news-room/hub',
                    languages:
                        'https://rock.prezly.com/settings/newsrooms/578e78e9-9a5b-44ad-bda2-5214895ee036/languages',
                    look_and_feel_settings:
                        'https://rock.prezly.com/settings/newsrooms/578e78e9-9a5b-44ad-bda2-5214895ee036/themes',
                    manual_subscription_management: '',
                    privacy_settings:
                        'https://rock.prezly.com/settings/newsrooms/578e78e9-9a5b-44ad-bda2-5214895ee036/privacy',
                    widget_settings: 'https://rock.prezly.com/pressroom/the-good-news-room/widget',
                },
                time_format: 'HH:mm',
                date_format: 'D/M/YY',
            },
            oembed: {
                type: 'link',
                url: 'https://the-good-news-room.prezly.com/adem',
                title: 'Adem!',
                description:
                    'Scrollen door je sociale media, levert deze dagen al snel een of andere post van een zelfgenaamde guru op die predikt dat dit een ideale moment is om je drukke leven even op pauze te zetten. Het is helemaal aan jou om te beslissen wat nu het beste is voor jou. Maar weinig mensen kunnen ontkennen dat nu een ideale moment is om je hoofd dor het raam te steken en grote gulpen fris(sere) lucht te nemen.',
                thumbnail_url:
                    'https://cdn.uc.assets.prezly.com/e9dc3b29-3d91-46e4-b9a0-695f8517bbf0/-/preview/600x600/',
                thumbnail_width: 1024,
                thumbnail_height: 482,
                version: '1.0',
            },
            links: {
                newsroom_view: 'https://the-good-news-room.prezly.com/adem',
                edit: 'https://rock.prezly.com/stories/380028',
                report: 'https://rock.prezly.com/stories/380028/report',
            },
        },
        {
            id: 492826,
            uuid: 'f6b9daa7-86fb-44f2-b3c3-7fe264b401d3',
            slug: 'translation-adem',
            thumbnail_url:
                'https://avatars-cdn.prezly.com/story/6337/492826/65269a918884e706d75759f309085f3552a7a3848f5df74e3a11bed8a5649ac3?t=1656401349&v=1',
            title: '[translation] Adem!',
            culture: {
                code: 'nl_NL',
                locale: 'nl_NL',
                name: 'Dutch (Netherlands)',
                native_name: 'Nederlands (Nederland)',
                direction: Culture.TextDirection.LTR,
                language_code: 'nl',
            },
            lifecycle_status: Story.LifecycleStatus.PUBLISHED,
            publication_status: Story.PublicationStatus.PUBLISHED,
            visibility: Story.Visibility.PUBLIC,
            created_at: '2022-06-28T07:29:03+00:00',
            updated_at: '2022-06-28T07:29:09+00:00',
            published_at: '2022-06-28T07:29:09+00:00',
            scheduled_at: null,
            author: {
                id: 10324,
                username: 'oleg@prezly.com',
                email: 'oleg@prezly.com',
                display_name: 'Oleg Semyonov',
                first_name: 'Oleg',
                last_name: 'Semyonov',
                avatar_url:
                    'https://avatars-cdn.prezly.com/user/10324/85fc2201624703503c24a3a97cc7e1776015e9f6ffe2ad96016650add0b9ab5f?v=1&c=add8f27908ec1f74f1a7c0530a74d88027eea08d05cac4300713d1c07fed0e1b',
                use_case_answer: User.UseCaseAnswer.UNKNOWN,
                sign_in_flow: User.SignInFlow.PASSWORD,
                created_at: '2021-02-25T13:30:04+00:00',
                is_terms_of_service_accepted: true,
                last_seen_at: '2022-06-28T09:06:32+00:00',
                locked_until: null,
            },
            newsroom: {
                uuid: '578e78e9-9a5b-44ad-bda2-5214895ee036',
                id: 12698,
                name: 'The Good News Room',
                display_name: 'The Good News Room',
                subdomain: 'the-good-news-room',
                thumbnail_url:
                    'https://avatars-cdn.prezly.com/newsroom/12698/e4939974b7781d4c61e282713116690387e9b7b1f6302478b13b68e18e0d3055?t=1648556918&v=1',
                timezone: 'europe/london',
                status: Newsroom.Status.ACTIVE,
                is_active: true,
                is_archived: false,
                is_online: true,
                is_offline: false,
                is_multilingual: true,
                is_indexable: true,
                url: 'https://the-good-news-room.prezly.com/',
                links: {
                    media_gallery_api: 'https://api.prezly.com/v1/rooms/12698/media',
                    analytics_and_visibility_settings:
                        'https://rock.prezly.com/pressroom/the-good-news-room/ga',
                    categories_management:
                        'https://rock.prezly.com/settings/newsrooms/578e78e9-9a5b-44ad-bda2-5214895ee036/categories',
                    company_info_settings:
                        'https://rock.prezly.com/settings/newsrooms/578e78e9-9a5b-44ad-bda2-5214895ee036/information',
                    contacts_management:
                        'https://rock.prezly.com/settings/newsrooms/578e78e9-9a5b-44ad-bda2-5214895ee036/contacts',
                    domain_settings: 'https://rock.prezly.com/pressroom/the-good-news-room/domain',
                    edit: 'https://rock.prezly.com/settings/newsrooms/578e78e9-9a5b-44ad-bda2-5214895ee036/information',
                    gallery_management:
                        'https://rock.prezly.com/pressroom/the-good-news-room/gallery',
                    hub_settings: 'https://rock.prezly.com/pressroom/the-good-news-room/hub',
                    languages:
                        'https://rock.prezly.com/settings/newsrooms/578e78e9-9a5b-44ad-bda2-5214895ee036/languages',
                    look_and_feel_settings:
                        'https://rock.prezly.com/settings/newsrooms/578e78e9-9a5b-44ad-bda2-5214895ee036/themes',
                    manual_subscription_management: '',
                    privacy_settings:
                        'https://rock.prezly.com/settings/newsrooms/578e78e9-9a5b-44ad-bda2-5214895ee036/privacy',
                    widget_settings: 'https://rock.prezly.com/pressroom/the-good-news-room/widget',
                },
                time_format: 'HH:mm',
                date_format: 'D/M/YY',
            },
            oembed: {
                type: 'link',
                url: 'https://the-good-news-room.prezly.com/translation-adem',
                title: '[translation] Adem!',
                description:
                    'Scrollen door je sociale media, levert deze dagen al snel een of andere post van een zelfgenaamde guru op die predikt dat dit een ideale moment is om je drukke leven even op pauze te zetten. Het is helemaal aan jou om te beslissen wat nu het beste is voor jou. Maar weinig mensen kunnen ontkennen dat nu een ideale moment is om je hoofd dor het raam te steken en grote gulpen fris(sere) lucht te nemen.',
                thumbnail_url:
                    'https://cdn.uc.assets.prezly.com/e9dc3b29-3d91-46e4-b9a0-695f8517bbf0/-/preview/600x600/',
                thumbnail_width: 1024,
                thumbnail_height: 482,
                version: '1.0',
            },
            links: {
                newsroom_view: 'https://the-good-news-room.prezly.com/translation-adem',
                edit: 'https://rock.prezly.com/stories/492826',
                report: 'https://rock.prezly.com/stories/492826/report',
            },
        },
    ],
    coverage_number: 0,
    last_coverage_at: null,
    content:
        '{"type":"document","children":[{"type":"paragraph","children":[{"text":"Air quality has been an important topic this millennium. There were those who didn\'t believe we had an impact on it, but these past weeks have proved otherwise. "}]},{"type":"block-quote","children":[{"text":"\\"Air quality is an important factor in determining our lifespan.\\""}]},{"type":"paragraph","children":[{"text":"In "},{"text":"India","bold":true},{"text":", the most air polluted country in the world, the difference is immense. Below, you can see a picture – the left side was taken November 3, 2019, the right side March 30, 2020."}]},{"type":"paragraph","children":[{"text":"What a difference."}]},{"type":"image-block","href":"","file":{"version":2,"uuid":"4fd7edc3-0e7b-4de5-8d88-6fc384cdabd4","filename":"200401105309-20200401-indian-gate-air-pollution-split-super-tease.jpg","mime_type":"image/jpeg","size":73660,"original_width":1100,"original_height":619,"effects":[]},"layout":"contained","align":"center","new_tab":true,"width":"100%","children":[{"text":"Source: https://www.theguardian.com/environment/2020/apr/11/positively-alpine-disbelief-air-pollution-falls-lockdown-coronavirus"}]},{"type":"paragraph","children":[{"text":"Also in India, people are sharing incredible pictures of their view of the Himalayas. For the first time in 30 years, people can see the mountains with crystal clarity from a distance of 200km."}]},{"type":"embed","children":[{"text":""}],"uuid":"539e96a5-f721-4629-aa7c-d9f9946ede28","url":"https://twitter.com/parasrishi/status/1246376229902536704","oembed":{"url":"https://twitter.com/parasrishi/status/1246376229902536704","html":"<div class=\\"iframely-embed\\" style=\\"max-width: 550px;\\"><div class=\\"iframely-responsive\\" style=\\"padding-bottom: 56.2493%;\\"><a href=\\"https://twitter.com/parasrishi/status/1246376229902536704\\" data-iframely-url=\\"//cdn.iframe.ly/api/iframe?url=https%3A%2F%2Ftwitter.com%2Fparasrishi%2Fstatus%2F1246376229902536704&amp;key=8fe6cdec03482ac31f27a6ae8ea2fb3f\\"></a></div></div><script async src=\\"//cdn.iframe.ly/embed.js\\" charset=\\"utf-8\\"></script>","type":"rich","title":"Paras पारस ਰਿਸ਼ੀ on Twitter","author":"Paras पारस ਰਿਸ਼ੀ","options":{"_theme":{"value":"","values":{"dark":"Use dark theme"}},"_hide_media":{"label":"Hide photos, videos, and cards","value":false}},"version":"1.0","cache_age":86400,"author_url":"https://twitter.com/parasrishi","description":"The mighty Himalayas are now visible from Pathankot, Punjab. Thanks to super visibility and no pollution. What an incredible sight! 😌 pic.twitter.com/dY4AI9ZvXa— Paras पारस ਰਿਸ਼ੀ (@parasrishi) April 4, 2020\\n\\n","provider_name":"Twitter","thumbnail_url":"https://pbs.twimg.com/media/EUwEkVvUMAAbdmp.jpg:large","screenshot_url":"https://avatars-cdn.prezly.com/embed/aHR0cHM6Ly90d2l0dGVyLmNvbS9wYXJhc3Jpc2hpL3N0YXR1cy8xMjQ2Mzc2MjI5OTAyNTM2NzA0/9b51f0059a1ab9aaa9cf7c096572d112766eab778ba0f603a66a92e86ce892f7?v=1583930760","thumbnail_width":960,"thumbnail_height":540}},{"type":"paragraph","children":[{"text":""}]},{"type":"paragraph","children":[{"text":"And the effect of the quarantine on air pollution isn\'t only visible in India. Across the world, countries are seeing the benefits in air quality:"}]},{"type":"gallery","children":[{"text":""}],"images":[{"caption":"Italy","file":{"version":2,"uuid":"d6b4a0cd-3dfb-4bcf-9488-06d5516875b3","filename":"Italy.jpg","mime_type":"image/jpeg","size":88682,"original_width":1050,"original_height":450,"effects":[]}},{"caption":"China","file":{"version":2,"uuid":"43645b68-e8f6-407e-9981-04c9d7fdd069","filename":"China.webp","mime_type":"image/webp","size":97888,"original_width":1443,"original_height":811,"effects":[]}},{"caption":"Spain","file":{"version":2,"uuid":"88057ea6-4afd-41d3-98db-5eecd82033ed","filename":"Spain.jpg","mime_type":"image/jpeg","size":87588,"original_width":1080,"original_height":405,"effects":[]}},{"caption":"France","file":{"version":2,"uuid":"dfa3b432-a375-4afd-983f-444540845f56","filename":"France.jpg","mime_type":"image/jpeg","size":141548,"original_width":1440,"original_height":810,"effects":[]}}],"uuid":"b3b49cb3-2495-4206-9219-afcf56a049b8","layout":"full-width","padding":"M","thumbnail_size":"XS"},{"type":"paragraph","children":[{"text":""}]},{"type":"heading-one","children":[{"text":"Exact numbers"}]},{"type":"paragraph","children":[{"text":"As everyone can see, air quality has improved. However, experts find it difficult to express the improvement in numbers. You may have seen several headlines which stated \'40% less air pollution\', this isn\'t completely accurate. Overall, the amount of nitrogen dioxide has fallen but the amount of fine dust is still (too) high."}]},{"type":"block-quote","children":[{"text":"\\"Maybe, when the crisis is over, we\'ll work more remotely, which is good news for our air quality.\\""}]}],"version":"0.50"}',
    thumbnail_image:
        '{"version":2,"uuid":"e9dc3b29-3d91-46e4-b9a0-695f8517bbf0","filename":"air.jpg","mime_type":"image/jpeg","size":50225,"original_width":1024,"original_height":482,"effects":[]}',
    header_image:
        '{"size":442609,"uuid":"e8605194-da87-45f4-a241-ecacc103f6b2","effects":["\\/crop\\/670x280\\/0,25\\/","\\/preview\\/"],"version":2,"filename":"header.png","mime_type":"image\\/png","original_width":670,"original_height":447}',
    preview_image:
        '{"size":50225,"uuid":"e9dc3b29-3d91-46e4-b9a0-695f8517bbf0","effects":[],"version":2,"filename":"air.jpg","mime_type":"image\\/jpeg","original_width":1024,"original_height":482}',
    tag_names: [],
    social_text: 'Take a breath',
    social_image: null,
    referenced_entities: {
        stories: {},
    },
};
