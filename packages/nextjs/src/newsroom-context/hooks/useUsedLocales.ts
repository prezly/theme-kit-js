import { useNewsroomContext } from '../context';

export function useUsedLocales() {
    const context = useNewsroomContext();

    return context.usedLocales;
}
