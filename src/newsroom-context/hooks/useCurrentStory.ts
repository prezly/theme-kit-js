import { useNewsroomContext } from './useNewsroomContext';

export function useCurrentStory() {
    const context = useNewsroomContext();

    return context.currentStory;
}
