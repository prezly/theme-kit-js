import { useNewsroomContext } from './useNewsroomContext';

export function useAlgoliaSettings() {
    const context = useNewsroomContext();

    return context.algoliaSettings;
}
