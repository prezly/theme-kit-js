import { useContext } from 'react';

import { NewsroomContext, NewsroomContextType } from '../context';

export const useNewsroomContext = () => {
    // TS Compiler is having a hard time figuring this type implicitly, so we have to set it explicitly
    // See https://github.com/microsoft/TypeScript/issues/5711#issuecomment-340283439
    const newsroomContext: NewsroomContextType | undefined = useContext(NewsroomContext);
    if (!newsroomContext) {
        throw new Error('No `NewsroomContextProvider` found when calling `useNewsroomContext`');
    }

    return newsroomContext;
};
