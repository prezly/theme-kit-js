import type { NewsroomCompanyInformation } from '@prezly/sdk';

type CompanySocialMediaInformation = Pick<
    NewsroomCompanyInformation,
    'facebook' | 'instagram' | 'linkedin' | 'pinterest' | 'tiktok' | 'twitter' | 'youtube'
>;

type CompanyAboutInformation = CompanySocialMediaInformation &
    Pick<NewsroomCompanyInformation, 'about' | 'website'>;

type CompanyContactInformation = Pick<
    NewsroomCompanyInformation,
    'address' | 'phone' | 'email' | 'website'
>;

export function hasAnySocialMedia(companyInformation: CompanySocialMediaInformation): boolean {
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

export function hasAnyAboutInformation(companyInformation: CompanyAboutInformation): boolean {
    return Boolean(
        companyInformation.about ||
            companyInformation.website ||
            hasAnySocialMedia(companyInformation),
    );
}

export function hasAnyContactInformation(companyInformation: CompanyContactInformation): boolean {
    return Boolean(
        companyInformation.address ||
            companyInformation.phone ||
            companyInformation.email ||
            companyInformation.website,
    );
}
