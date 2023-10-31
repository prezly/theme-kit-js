export type SocialNetwork =
    | 'facebook'
    | 'instagram'
    | 'linkedin'
    | 'pinterest'
    | 'tiktok'
    | 'twitter'
    | 'youtube';

/**
 * Instagram, TikTok and YouTube don't provide URL sharing to their networks as of October 2023
 */
export type ShareableSocialNetwork = Exclude<SocialNetwork, 'instagram' | 'tiktok' | 'youtube'>;

export type StoryShareLinksLayout = 'vertical' | 'horizontal';
