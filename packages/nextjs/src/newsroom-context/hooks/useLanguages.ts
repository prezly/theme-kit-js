import { useNewsroomContext } from './useNewsroomContext.js';

export function useLanguages() {
    const context = useNewsroomContext();

    return context.languages;
}
