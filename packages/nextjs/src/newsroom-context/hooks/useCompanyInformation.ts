import { useNewsroomContext } from '../context';

export function useCompanyInformation() {
    const context = useNewsroomContext();

    return context.companyInformation;
}
