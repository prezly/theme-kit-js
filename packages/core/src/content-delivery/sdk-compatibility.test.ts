import { ApiError, createPrezlyClient, Story } from '@prezly/sdk';

import { createClient } from './ContentDelivery';

function setup(body: unknown, status = 200) {
    const fetch = jest.fn(
        async (_url: string, _init?: RequestInit) =>
            new Response(JSON.stringify(body), {
                status,
                headers: { 'content-type': 'application/json' },
            }),
    );
    const sdk = createPrezlyClient({ accessToken: 'test-token', fetch });
    return {
        client: createClient(sdk, 'test-newsroom', undefined),
        request: () => new URL(String(fetch.mock.calls[0][0])),
        init: () => fetch.mock.calls[0][1]!,
    };
}

describe('ContentDelivery with the installed SDK', () => {
    it('unwraps newsroom, theme, language, category and gallery responses', async () => {
        const newsroom = { uuid: 'test-newsroom' };
        const theme = { id: 'test-theme', settings: { title: 'Theme' } };
        const language = { code: 'en', is_default: true };
        const category = { id: 7 };
        const gallery = { uuid: 'test-gallery' };
        const fetch = jest.fn(
            async () =>
                new Response(
                    JSON.stringify({
                        newsroom,
                        theme,
                        languages: [language],
                        categories: [category],
                        galleries: [gallery],
                        gallery,
                    }),
                    { headers: { 'content-type': 'application/json' } },
                ),
        );
        const sdk = createPrezlyClient({ accessToken: 'test-token', fetch });
        const client = createClient(sdk, 'test-newsroom', 'test-theme');
        await expect(client.newsroom()).resolves.toEqual(newsroom);
        await expect(client.themeSettings()).resolves.toEqual(theme.settings);
        await expect(client.languages()).resolves.toEqual([language]);
        await expect(client.categories()).resolves.toEqual([category]);
        await expect(client.galleries()).resolves.toMatchObject({ galleries: [gallery] });
        await expect(client.gallery(gallery.uuid)).resolves.toEqual(gallery);
    });

    it('preserves featured contact social profiles and filters by is_featured', async () => {
        const contact = {
            uuid: '824b29da-97a1-44f2-ab45-f708ab268afc',
            facebook: 'https://facebook.com/prezly',
            twitter: 'https://twitter.com/prezly',
            linkedin: 'https://linkedin.com/in/test-contact',
            instagram: 'https://instagram.com/prezly',
        };
        const { client, request } = setup({ contacts: [contact] });

        await expect(client.featuredContacts()).resolves.toEqual([contact]);
        expect(request().pathname).toBe('/v2/newsrooms/test-newsroom/contacts');
        expect(JSON.parse(request().searchParams.get('query')!)).toEqual({ is_featured: true });
    });

    it('serializes story filters, pagination, sort order, formats and extra fields', async () => {
        const result = { stories: [], pagination: { total: 0 } };
        const { client, request, init } = setup(result);
        await expect(
            client.stories(
                { limit: 10, offset: 10, highlighted: 2, locale: 'en', categories: [{ id: 7 }] },
                { include: ['content'] },
            ),
        ).resolves.toEqual(result);
        expect(request().pathname).toBe('/v2/stories/search');
        expect(init().method).toBe('POST');
        const payload = JSON.parse(String(init().body));
        expect(payload).toMatchObject({
            limit: 10,
            offset: 12,
            sort: '-is_pinned,-published_at',
            include: 'content',
        });
        expect(new Headers(init().headers).get('accept')).toContain('content-format=v4');
        expect(payload.query).toEqual({
            'category.id': { $all: [7] },
            'newsroom.uuid': { $in: ['test-newsroom'] },
            locale: { $in: ['en'] },
            status: { $in: [Story.Status.PUBLISHED] },
            visibility: { $in: [Story.Visibility.PUBLIC] },
        });
    });

    it.each([{ uuid: 'test-story' }, { slug: 'test-story' }])(
        'retrieves story content and extended fields using %j',
        async (lookup) => {
            const story = { uuid: 'test-story', content: 'story content', subtitle: 'Subtitle' };
            const { client, request } = setup({ story });
            await expect(client.story(lookup, { include: ['content'] })).resolves.toEqual(story);
            expect(request().searchParams.getAll('include[]')).toEqual(
                expect.arrayContaining(['content', 'header_image']),
            );
        },
    );

    it.each([403, 404, 410])('maps SDK HTTP %s errors to missing content', async (status) => {
        const { client } = setup({ message: 'Unavailable' }, status);
        await expect(client.story({ uuid: 'test-story' })).resolves.toBeNull();
        await expect(client.story({ slug: 'test-story' })).resolves.toBeNull();
        await expect(client.gallery('test-gallery')).resolves.toBeNull();
    });

    it.each([401, 429, 500])('propagates SDK HTTP %s errors', async (status) => {
        const { client } = setup({ message: 'Failure' }, status);
        await expect(client.story({ uuid: 'test-story' })).rejects.toBeInstanceOf(ApiError);
        await expect(client.story({ slug: 'test-story' })).rejects.toMatchObject({ status });
        await expect(client.gallery('test-gallery')).rejects.toMatchObject({ status });
    });
});
