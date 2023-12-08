import { useNewsroomContext } from '../context';

export function useLocales() {
    const context = useNewsroomContext();

    return context.locales;
}
