/* eslint-disable @typescript-eslint/no-use-before-define */
import type { IncomingMessage } from 'http';
import parseDataUrl from 'parse-data-url';
import 'server-only';

import type { PrezlyEnv } from './types';

export function boot<EnvType extends PrezlyEnv = PrezlyEnv>(
    request?: IncomingMessage,
): NodeJS.ProcessEnv & EnvType {
    const headerName = (process.env.HTTP_ENV_HEADER || '').toLowerCase();
    const httpEnvHeader = headerName ? request?.headers[headerName] : undefined;

    const env =
        httpEnvHeader && typeof httpEnvHeader === 'string'
            ? combine(process.env, httpEnvHeader)
            : process.env;

    return env as NodeJS.ProcessEnv & EnvType;
}

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
