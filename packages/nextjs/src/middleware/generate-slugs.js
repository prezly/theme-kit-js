/* eslint-disable @typescript-eslint/no-use-before-define */

import { createPrezlyClient } from '@prezly/sdk';
import { Locale } from '@prezly/theme-kit-intl';

if (!process.env.PREZLY_ACCESS_TOKEN) {
    console.error('Please provide PREZLY_ACCESS_TOKEN env variable.');
    console.error('\nUsage:');
    console.error(' PREZLY_ACCESS_TOKEN=node generate-slugs.js > slugs.ts');
    process.exit(1);
}

const client = createPrezlyClient({
    baseUrl: process.env.PREZLY_API_BASE_URL,
    accessToken: process.env.PREZLY_ACCESS_TOKEN,
});

generateScript();

async function generateScript() {
    /**
     * @type {{ cultures: import('@prezly/sdk').CultureRef[] }}
     */
    const response = await client.api.get('/v2/cultures');

    const slugs = combinations(response.cultures);

    const script = `
// WARNING: This file was autogenerated with generate-slugs.js
//          Please do not modify it manually.
export const slugs = ${JSON.stringify(slugs, undefined, 4)};
`;

    console.log(script);
}

/**
 * @param {import('@prezly/sdk').CultureRef[]} cultures
 * @returns {string[]}
 */
function combinations(cultures) {
    const codes = cultures.map((culture) => culture.code.toLowerCase());
    const slugs = codes.map((code) => Locale.from(code).slug);
    const langs = codes.map((code) => Locale.from(code).lang);
    const regions = codes.map((code) => Locale.from(code).region?.toLowerCase());

    return unique([...codes, ...slugs, ...langs, ...regions].filter(Boolean));
}

/**
 * @param {string[]} values
 * @returns {string[]}
 */
function unique(values) {
    return Array.from(new Set(values).values());
}
