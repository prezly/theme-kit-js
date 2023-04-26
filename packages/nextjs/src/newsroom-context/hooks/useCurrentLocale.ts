import { useNewsroomContext } from './useNewsroomContext.js';

export function useCurrentLocale() {
    const context = useNewsroomContext();

    return context.locale;
}
