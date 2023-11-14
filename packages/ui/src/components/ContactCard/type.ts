import type { NewsroomContact } from '@prezly/sdk';

export type ContactInfo = Pick<
    NewsroomContact,
    | 'avatar_image'
    | 'name'
    | 'description'
    | 'company'
    | 'email'
    | 'phone'
    | 'mobile'
    | 'website'
    | 'facebook'
    | 'twitter'
>;
