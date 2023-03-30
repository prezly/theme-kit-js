import { useNewsroomContext } from './useNewsroomContext';

export function useCurrentCategory() {
    const context = useNewsroomContext();

    return context.currentCategory;
}
