import { type Resolvable, resolve } from '../../utils';

export namespace AnalyticsAdapter {
    export interface Configuration {
        isTrackingEnabled: Resolvable<boolean>;
    }

    export function connect(config: Configuration) {
        function useAnalytics() {
            return {
                isTrackingEnabled: resolve(config.isTrackingEnabled),
            };
        }

        return { useAnalytics };
    }
}
