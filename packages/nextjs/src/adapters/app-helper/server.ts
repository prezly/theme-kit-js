export namespace AppHelperAdapter {
    export interface Configuration<T, I> {
        createAppHelper: () => T;
        identifyRequestContext?: () => I;
    }

    export function connect<T, I extends object>({
        createAppHelper,
        identifyRequestContext,
    }: Configuration<T, I>) {
        type AppHelper = ReturnType<typeof createAppHelper>;

        const INSTANCES = new WeakMap<I, AppHelper>();

        function useApp() {
            if (identifyRequestContext) {
                const key = identifyRequestContext();
                const cached = INSTANCES.get(key);
                const instance = cached ?? createAppHelper();

                if (!cached) {
                    INSTANCES.set(key, instance);
                }

                return instance;
            }

            return createAppHelper();
        }

        return { useApp };
    }
}
