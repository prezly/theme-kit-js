import { useNewsroomContext } from './useNewsroomContext';

export function useLanguages() {
    const context = useNewsroomContext();

    return context.languages;
}
