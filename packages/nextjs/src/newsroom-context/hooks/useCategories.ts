import { useNewsroomContext } from './useNewsroomContext.js';

export function useCategories() {
    const context = useNewsroomContext();

    return context.categories;
}
