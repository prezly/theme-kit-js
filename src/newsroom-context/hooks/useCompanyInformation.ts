import { useNewsroomContext } from './useNewsroomContext';

export function useCompanyInformation() {
    const context = useNewsroomContext();

    return context.companyInformation;
}
