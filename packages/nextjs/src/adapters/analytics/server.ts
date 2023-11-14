import { type AsyncResolvable, resolveAsync } from '../../utils';

export namespace AnalyticsAdapter {
    export interface Configuration {
        isTrackingEnabled: AsyncResolvable<boolean>;
    }

    export function connect(config: Configuration) {
        async function useAnalytics() {
            return {
                isTrackingEnabled: resolveAsync(config.isTrackingEnabled),
            };
        }

        return { useAnalytics };
    }
}
