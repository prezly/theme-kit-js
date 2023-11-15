/* eslint-disable @typescript-eslint/no-use-before-define */
import parseDataUrl from 'parse-data-url';

export function combine(
    vars: NodeJS.ProcessEnv,
    httpEnvHeader?: string | null | undefined,
): Record<string, unknown> {
    if (httpEnvHeader) {
        const httpEnv = decodeHttpEnvHeader(httpEnvHeader);

        return { ...vars, ...httpEnv };
    }

    return { ...vars };
}

function decodeHttpEnvHeader(header: string): Record<string, any> {
    if (header.startsWith('data:')) {
        const parsed = parseDataUrl(header);
        if (parsed && parsed.contentType === 'application/json') {
            const data = parsed.toBuffer().toString('utf-8');
            return decodeJson(data);
        }
        return {}; // unsupported data-uri
    }
    return decodeJson(header);
}

function decodeJson(json: string): Record<string, any> {
    try {
        const decoded = JSON.parse(json);
        if (decoded && typeof decoded === 'object') {
            return decoded;
        }
    } catch {
        // passthru
    }
    return {};
}
