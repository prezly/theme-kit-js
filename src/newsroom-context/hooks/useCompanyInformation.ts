import { useNewsroomContext } from './useNewsroomContext';

export const useCompanyInformation = () => {
    const context = useNewsroomContext();

    return context.companyInformation;
};
