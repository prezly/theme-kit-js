import { type Resolvable, resolve } from '#utils';

import { collectEnvVariables } from './lib';

export namespace EnvironmentAdapter {
    export interface Configuration {
        httpEnvHeader?: Resolvable<string | null | undefined>;
    }

    export function connect<T>(
        validate: (vars: Record<string, unknown>) => T,
        options: Configuration = {},
    ) {
        function useEnvironment(): T {
            const httpEnvHeader = resolve(options.httpEnvHeader);
            const variables = collectEnvVariables(process.env, httpEnvHeader);
            return validate(variables);
        }

        return { useEnvironment };
    }
}
