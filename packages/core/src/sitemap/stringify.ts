/* eslint-disable @typescript-eslint/no-use-before-define */
import type { AlternateLink, SitemapFile, SitemapFileEntry } from './types';

export function stringify(sitemap: SitemapFile) {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.w3.org/TR/xhtml11/xhtml11_schema.html http://www.w3.org/2002/08/xhtml/xhtml1-strict.xsd" 
                xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
                xmlns:xhtml="http://www.w3.org/TR/xhtml11/xhtml11_schema.html">
            ${sitemap.map(stringifyEntry).join('\n')}
        </urlset>
    `;
}

function stringifyEntry(entry: SitemapFileEntry) {
    return `<url>
      <loc>${entry.url}</loc>
      ${entry.lastModified ? `<lastmod>${stringifyDate(entry.lastModified)}</lastmod>` : ''}
      ${entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : ''}
      ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
      ${(entry.alternate ?? []).map(stringifyAlternateLink).join('')}
    </url>`;
}

function stringifyAlternateLink(alt: AlternateLink): string {
    return `<xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.url}" />`;
}

function stringifyDate(date: string | Date) {
    if (date instanceof Date) {
        return date.toISOString();
    }
    return date;
}
