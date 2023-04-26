import { useNewsroomContext } from './useNewsroomContext.js';

export function useCurrentCategory() {
    const context = useNewsroomContext();

    return context.currentCategory;
}
