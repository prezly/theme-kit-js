import { jest } from '@jest/globals';
import { createPrezlyClient } from '@prezly/sdk';

import { createClient } from './ContentDelivery';

describe('featuredContacts', () => {
    it('preserves social profiles returned by the SDK', async () => {
        const contact = {
            uuid: '824b29da-97a1-44f2-ab45-f708ab268afc',
            facebook: 'https://facebook.com/prezly',
            twitter: 'https://twitter.com/prezly',
            linkedin: 'https://linkedin.com/in/test-contact',
            instagram: 'https://instagram.com/prezly',
        };
        const fetch = jest.fn(
            async () =>
                new Response(JSON.stringify({ contacts: [contact] }), {
                    headers: [['Content-Type', 'application/json']],
                }),
        );
        const prezly = createPrezlyClient({ accessToken: 'test-token', fetch });
        const client = createClient(prezly, 'test-newsroom', undefined);

        await expect(client.featuredContacts()).resolves.toEqual([contact]);
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/newsrooms/test-newsroom/contacts?'),
            expect.anything(),
        );
    });
});
