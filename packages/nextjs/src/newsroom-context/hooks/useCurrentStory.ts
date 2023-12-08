import { useNewsroomContext } from '../context';

export function useCurrentStory() {
    const context = useNewsroomContext();

    return context.currentStory;
}
