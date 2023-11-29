import { Environment, Resolvable } from '@prezly/theme-kit-core';

type HttpEnvHeader = string;

export namespace EnvironmentAdapter {
    export interface Configuration {
        httpEnvHeader?: Resolvable<HttpEnvHeader | null | undefined>;
    }

    export function connect<T>(
        validate: (vars: Record<string, unknown>) => T,
        options: Configuration = {},
    ) {
        function useEnvironment(): T {
            const httpEnvHeader = Resolvable.resolve(options.httpEnvHeader);
            const variables = Environment.combine(process.env, httpEnvHeader);
            return validate(variables);
        }

        return { useEnvironment };
    }
}
