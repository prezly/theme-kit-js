export function integrateAppHelper<T, I extends object>(
    createAppHelper: () => T,
    identifyContext: () => I,
) {
    type AppHelper = ReturnType<typeof createAppHelper>;

    const INSTANCES = new WeakMap<I, AppHelper>();

    function useApp() {
        const key = identifyContext();
        const cached = INSTANCES.get(key);
        const instance = cached ?? createAppHelper();

        if (!cached) {
            INSTANCES.set(key, instance);
        }

        return instance;
    }

    return { useApp };
}
