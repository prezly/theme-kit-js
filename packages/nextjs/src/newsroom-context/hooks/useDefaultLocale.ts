import { useNewsroomContext } from '../context';

export function useDefaultLocale() {
    const context = useNewsroomContext();

    return context.defaultLocale;
}
