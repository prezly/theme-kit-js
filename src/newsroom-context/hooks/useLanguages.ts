import { useNewsroomContext } from './useNewsroomContext';

export const useLanguages = () => {
    const context = useNewsroomContext();

    return context.languages;
};
