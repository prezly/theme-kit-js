import { useNewsroomContext } from './useNewsroomContext';

export const useCurrentStory = () => {
    const context = useNewsroomContext();

    return context.currentStory;
};
