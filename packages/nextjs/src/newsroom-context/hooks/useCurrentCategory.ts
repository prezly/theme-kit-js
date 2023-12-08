import { useNewsroomContext } from '../context';

export function useCurrentCategory() {
    const context = useNewsroomContext();

    return context.currentCategory;
}
