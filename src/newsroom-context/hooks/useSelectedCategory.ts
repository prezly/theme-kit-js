import { useNewsroomContext } from './useNewsroomContext';

export const useSelectedCategory = () => {
    const context = useNewsroomContext();

    return context.selectedCategory;
};
