export function extractDomainFromUrl(url: string): string {
    let result = '';
    let match: RegExpMatchArray | null = null;

    match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\\/\n\\?\\=]+)/im);

    if (match) {
        [, result] = match;

        match = result.match(/^[^\\.]+\.(.+\..+)$/);

        if (match) {
            [, result] = match;
        }
    }

    return result ?? url;
}
