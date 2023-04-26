import { useNewsroomContext } from './useNewsroomContext.js';

export function useCurrentStory() {
    const context = useNewsroomContext();

    return context.currentStory;
}
