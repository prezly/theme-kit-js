import { useNewsroomContext } from './useNewsroomContext';

export const useAlgoliaSettings = () => {
    const context = useNewsroomContext();

    return context.algoliaSettings;
};
