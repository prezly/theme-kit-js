import { useNewsroomContext } from './useNewsroomContext';

export function useNewsroom() {
    const context = useNewsroomContext();

    return context.newsroom;
}
