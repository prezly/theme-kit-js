import { useNewsroomContext } from './useNewsroomContext';

export const useCurrentLocale = () => {
    const context = useNewsroomContext();

    return context.locale;
};
