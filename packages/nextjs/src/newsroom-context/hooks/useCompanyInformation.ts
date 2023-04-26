import { useNewsroomContext } from './useNewsroomContext.js';

export function useCompanyInformation() {
    const context = useNewsroomContext();

    return context.companyInformation;
}
