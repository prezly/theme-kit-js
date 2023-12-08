import { useNewsroomContext } from '../context';

export function useCurrentLocale() {
    const context = useNewsroomContext();

    return context.locale;
}
