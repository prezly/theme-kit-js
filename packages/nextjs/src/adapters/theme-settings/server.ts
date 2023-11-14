import { type AsyncResolvable, resolveAsync, withoutUndefined } from '#utils';

export namespace ThemeSettingsAdapter {
    export interface Configuration<T> {
        defaults: AsyncResolvable<T>;
        settings: AsyncResolvable<Partial<T> | undefined>;
    }

    export function connect<T>(config: Configuration<T>) {
        async function useThemeSettings(): Promise<T> {
            const [defaults, settings] = await resolveAsync([config.defaults, config.settings]);

            return {
                ...defaults,
                ...withoutUndefined(settings ?? {}),
            } as T;
        }

        return { useThemeSettings };
    }
}
