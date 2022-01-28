import { useNewsroomContext } from './useNewsroomContext';

export const useCategories = () => {
    const context = useNewsroomContext();

    return context.categories;
};
