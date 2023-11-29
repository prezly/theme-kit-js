import { Resolvable } from '@prezly/theme-kit-core';

export namespace AnalyticsAdapter {
    export interface Configuration {
        isTrackingEnabled: Resolvable<boolean>;
    }

    export function connect(config: Configuration) {
        function useAnalytics() {
            return {
                isTrackingEnabled: Resolvable.resolve(config.isTrackingEnabled),
            };
        }

        return { useAnalytics };
    }
}
