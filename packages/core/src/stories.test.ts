import { Story } from '@prezly/sdk';
import type { StoryRef } from '@prezly/sdk';

import { getPublicTranslations, isPubliclyPublished } from './stories';

function translation(
    code: string,
    status: Story.Status,
    visibility: Story.Visibility = Story.Visibility.PUBLIC,
) {
    return { culture: { code }, status, visibility } as StoryRef;
}

describe('isPubliclyPublished', () => {
    it('accepts a published public story', () => {
        expect(
            isPubliclyPublished({
                status: Story.Status.PUBLISHED,
                visibility: Story.Visibility.PUBLIC,
            }),
        ).toBe(true);
    });

    it.each([Story.Visibility.PRIVATE, Story.Visibility.CONFIDENTIAL, Story.Visibility.EMBARGO])(
        'rejects a published %s story',
        (visibility) => {
            expect(isPubliclyPublished({ status: Story.Status.PUBLISHED, visibility })).toBe(false);
        },
    );

    it.each([
        Story.Status.UNINITIALIZED,
        Story.Status.DRAFT,
        Story.Status.SCHEDULED,
        Story.Status.EMBARGO,
    ])('rejects a public story with the %s status', (status) => {
        expect(isPubliclyPublished({ status, visibility: Story.Visibility.PUBLIC })).toBe(false);
    });
});

describe('getPublicTranslations', () => {
    it('keeps only the published public translations', () => {
        const translations = [
            translation('en', Story.Status.PUBLISHED),
            translation('fr', Story.Status.DRAFT),
            translation('de', Story.Status.SCHEDULED),
            translation('es', Story.Status.EMBARGO, Story.Visibility.EMBARGO),
            translation('nl', Story.Status.PUBLISHED, Story.Visibility.PRIVATE),
            translation('it', Story.Status.PUBLISHED, Story.Visibility.CONFIDENTIAL),
            translation('pt', Story.Status.PUBLISHED),
        ];

        expect(getPublicTranslations({ translations }).map((story) => story.culture.code)).toEqual([
            'en',
            'pt',
        ]);
    });

    it('returns an empty list when the story has no translations', () => {
        expect(getPublicTranslations({ translations: [] })).toEqual([]);
    });
});
