import { useNewsroomContext } from '../context';

export function useAlgoliaSettings() {
    const context = useNewsroomContext();

    return context.algoliaSettings;
}
