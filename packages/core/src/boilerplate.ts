import type { NewsroomCompanyInformation } from '@prezly/sdk';

type CompanyInformationWithSocialMedia = Pick<
    NewsroomCompanyInformation,
    'facebook' | 'instagram' | 'linkedin' | 'pinterest' | 'tiktok' | 'twitter' | 'youtube'
>;

export function hasAnySocialMedia(companyInformation: CompanyInformationWithSocialMedia): boolean {
    return Boolean(
        companyInformation.facebook ||
            companyInformation.instagram ||
            companyInformation.linkedin ||
            companyInformation.pinterest ||
            companyInformation.tiktok ||
            companyInformation.twitter ||
            companyInformation.youtube,
    );
}

type CompanyInformationWithAboutInformation = CompanyInformationWithSocialMedia &
    Pick<NewsroomCompanyInformation, 'about' | 'website'>;

export function hasAnyAboutInformation(
    companyInformation: CompanyInformationWithAboutInformation,
): boolean {
    return Boolean(
        companyInformation.about ||
            companyInformation.website ||
            hasAnySocialMedia(companyInformation),
    );
}

type CompanyInformationWithContactInformation = Pick<
    NewsroomCompanyInformation,
    'address' | 'phone' | 'email' | 'website'
>;

export function hasAnyContactInformation(
    companyInformation: CompanyInformationWithContactInformation,
): boolean {
    return Boolean(
        companyInformation.address ||
            companyInformation.phone ||
            companyInformation.email ||
            companyInformation.website,
    );
}
