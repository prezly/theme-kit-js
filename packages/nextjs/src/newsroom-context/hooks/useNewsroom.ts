import { useNewsroomContext } from '../context';

export function useNewsroom() {
    const context = useNewsroomContext();

    return context.newsroom;
}
