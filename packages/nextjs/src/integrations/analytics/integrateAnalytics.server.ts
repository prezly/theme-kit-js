import { type AsyncResolvable, resolveAsync } from '../../utils';

interface Configuration {
    isTrackingEnabled: AsyncResolvable<boolean>;
}

export function integrateAnalytics(config: Configuration) {
    async function useAnalytics() {
        return {
            isTrackingEnabled: resolveAsync(config.isTrackingEnabled),
        };
    }

    return { useAnalytics };
}
