import { type Resolvable, resolve } from '../../utils';

import { collectEnvVariables } from './lib';

interface Options {
    httpEnvHeader?: Resolvable<string | null | undefined>;
}

export function integrateEnvironment<T>(
    validate: (vars: Record<string, unknown>) => T,
    options: Options = {},
) {
    function useEnvironment(): T {
        const httpEnvHeader = resolve(options.httpEnvHeader);
        const variables = collectEnvVariables(process.env, httpEnvHeader);
        return validate(variables);
    }

    return { useEnvironment };
}
