export type SitemapUrl = {
    location: string;
    changeFrequency?: string;
    priority?: string;
    alternateLinks?: {
        lang: string;
        href: string;
    }[];
};
