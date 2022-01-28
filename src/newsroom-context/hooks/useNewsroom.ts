import { useNewsroomContext } from './useNewsroomContext';

export const useNewsroom = () => {
    const context = useNewsroomContext();

    return context.newsroom;
};
