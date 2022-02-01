import { useNewsroomContext } from './useNewsroomContext';

export const useCurrentCategory = () => {
    const context = useNewsroomContext();

    return context.currentCategory;
};
