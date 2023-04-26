import { useNewsroomContext } from './useNewsroomContext.js';

export function useNewsroom() {
    const context = useNewsroomContext();

    return context.newsroom;
}
