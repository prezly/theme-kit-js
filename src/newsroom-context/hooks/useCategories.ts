import { useNewsroomContext } from './useNewsroomContext';

export function useCategories() {
    const context = useNewsroomContext();

    return context.categories;
}
