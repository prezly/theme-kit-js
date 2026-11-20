import { Story } from '@prezly/sdk';
import type {
    Newsroom,
    NewsroomCompanyInformation,
    NewsroomLanguageSettings,
    StoryRef,
} from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-intl';

import { generateStoryPageMetadata } from './generateStoryPageMetadata';
import type { AbsoluteUrlGenerator } from './types';

const LANGUAGES: Locale.Code[] = ['en', 'fr', 'de', 'es', 'nl', 'it'];

function translation(
    code: Locale.Code,
    status: Story.Status = Story.Status.PUBLISHED,
    visibility: Story.Visibility = Story.Visibility.PUBLIC,
) {
    return { culture: { code }, slug: `story-${code}`, status, visibility } as StoryRef;
}

function story(
    translations: StoryRef[],
    status: Story.Status = Story.Status.PUBLISHED,
    visibility: Story.Visibility = Story.Visibility.PUBLIC,
) {
    return {
        ...translation('en', status, visibility),
        title: 'Story',
        subtitle: 'Subtitle',
        summary: '',
        author: null,
        updated_at: '2026-01-01T00:00:00Z',
        published_at: '2026-01-01T00:00:00Z',
        oembed: { url: 'https://example.com/story-en', title: 'Story' },
        seo_settings: {},
        translations,
    } as unknown as Story;
}

async function alternateLanguages(value: Story) {
    const generateUrl: AbsoluteUrlGenerator = (_route, params) =>
        `https://example.com/${params.localeCode}/${'slug' in params ? params.slug : ''}`;

    const metadata = await generateStoryPageMetadata({
        story: value,
        newsroom: { uuid: 'newsroom', display_name: 'Newsroom' } as Newsroom,
        companyInformation: { name: 'Company' } as NewsroomCompanyInformation,
        languages: LANGUAGES.map(
            (code) => ({ code, is_default: code === 'en' }) as NewsroomLanguageSettings,
        ),
        generateUrl: () => generateUrl,
    });

    return metadata.alternates?.languages;
}

describe('generateStoryPageMetadata', () => {
    it('links to the published public translations', async () => {
        const languages = await alternateLanguages(story([translation('fr'), translation('de')]));

        expect(languages).toEqual({
            en: 'https://example.com/en/story-en',
            fr: 'https://example.com/fr/story-fr',
            de: 'https://example.com/de/story-de',
            'x-default': 'https://example.com/en/story-en',
        });
    });

    it('omits translations that are not publicly published', async () => {
        const languages = await alternateLanguages(
            story([
                translation('fr', Story.Status.DRAFT),
                translation('de', Story.Status.SCHEDULED),
                translation('es', Story.Status.EMBARGO, Story.Visibility.EMBARGO),
                translation('nl', Story.Status.PUBLISHED, Story.Visibility.PRIVATE),
                translation('it', Story.Status.PUBLISHED, Story.Visibility.CONFIDENTIAL),
            ]),
        );

        expect(languages).toEqual({
            en: 'https://example.com/en/story-en',
            'x-default': 'https://example.com/en/story-en',
        });
    });

    it('keeps the link to a private story on its own page', async () => {
        const languages = await alternateLanguages(
            story(
                [
                    translation('fr'),
                    translation('nl', Story.Status.PUBLISHED, Story.Visibility.PRIVATE),
                ],
                Story.Status.PUBLISHED,
                Story.Visibility.PRIVATE,
            ),
        );

        expect(languages).toEqual({
            en: 'https://example.com/en/story-en',
            fr: 'https://example.com/fr/story-fr',
            'x-default': 'https://example.com/en/story-en',
        });
    });

    it('omits the link to an unpublished story on its own page', async () => {
        const languages = await alternateLanguages(story([translation('fr')], Story.Status.DRAFT));

        expect(languages).toEqual({
            fr: 'https://example.com/fr/story-fr',
        });
    });
});
