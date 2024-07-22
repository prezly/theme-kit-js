import { useNewsroomContext } from './useNewsroomContext';

export function useSearchSettings() {
    const { searchSettings } = useNewsroomContext();
    return searchSettings;
}
