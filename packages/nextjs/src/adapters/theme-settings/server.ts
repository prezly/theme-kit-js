import { AsyncResolvable } from '@prezly/theme-kit-core';
import { omitUndefined } from '@technically/omit-undefined';

export namespace ThemeSettingsAdapter {
    export interface Configuration<T> {
        defaults: AsyncResolvable<T>;
        settings: AsyncResolvable<Partial<T> | undefined>;
    }

    export function connect<T>(config: Configuration<T>) {
        async function useThemeSettings(): Promise<T> {
            const [defaults, settings] = await AsyncResolvable.resolve(
                config.defaults,
                config.settings,
            );

            return {
                ...defaults,
                ...omitUndefined(settings ?? {}),
            } as T;
        }

        return { useThemeSettings };
    }
}
