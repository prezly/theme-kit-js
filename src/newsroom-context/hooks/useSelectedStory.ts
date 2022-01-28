import { useNewsroomContext } from './useNewsroomContext';

export const useSelectedStory = () => {
    const context = useNewsroomContext();

    return context.selectedStory;
};
