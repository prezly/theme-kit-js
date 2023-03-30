import type { IncomingMessage } from 'http';
import parseDataUrl from 'parse-data-url';

import type { PrezlyEnv } from '../types';

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

function decodeHttpEnv(header: string): Record<string, any> {
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

export function getEnvVariables<EnvType extends PrezlyEnv = PrezlyEnv>(
    req?: IncomingMessage,
): NodeJS.ProcessEnv & EnvType {
    if (typeof window !== 'undefined') {
        throw new Error('"getEnvVariables" should only be used on back-end side.');
    }

    const headerName = (process.env.HTTP_ENV_HEADER || '').toLowerCase();

    if (headerName && req) {
        const header = req.headers[headerName] as string | undefined;
        const httpEnv = decodeHttpEnv(header || '');
        return { ...process.env, ...httpEnv } as NodeJS.ProcessEnv & EnvType;
    }

    return { ...process.env } as NodeJS.ProcessEnv & EnvType;
}
