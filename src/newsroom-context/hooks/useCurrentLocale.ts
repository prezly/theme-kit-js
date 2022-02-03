import { useNewsroomContext } from './useNewsroomContext';

export function useCurrentLocale() {
    const context = useNewsroomContext();

    return context.locale;
}
