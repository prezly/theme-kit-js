import { useNewsroomContext } from '../context';

export function useCategories() {
    const context = useNewsroomContext();

    return context.categories;
}
