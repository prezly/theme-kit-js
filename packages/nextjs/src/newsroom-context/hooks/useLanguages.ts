import { useNewsroomContext } from '../context';

export function useLanguages() {
    const context = useNewsroomContext();

    return context.languages;
}
