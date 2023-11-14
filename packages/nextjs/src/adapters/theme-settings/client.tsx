'use client';

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

import { withoutUndefined } from '#utils';

export namespace ThemeSettingsAdapter {
    export interface Configuration<T> {
        defaults: T;
    }

    export function connect<T>(config: Configuration<T>) {
        const context = createContext<T>(config.defaults);

        function ThemeSettingsProvider(props: {
            settings: Partial<T> | undefined;
            children: ReactNode;
        }) {
            const settings = {
                ...config.defaults,
                ...withoutUndefined(props.settings ?? {}),
            };
            return <context.Provider value={settings}>{props.children}</context.Provider>;
        }

        function useThemeSettings() {
            return useContext(context);
        }

        return { ThemeSettingsProvider, useThemeSettings };
    }
}
