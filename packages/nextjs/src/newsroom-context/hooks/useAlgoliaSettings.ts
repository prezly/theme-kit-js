import { useNewsroomContext } from './useNewsroomContext.js';

export function useAlgoliaSettings() {
    const context = useNewsroomContext();

    return context.algoliaSettings;
}
