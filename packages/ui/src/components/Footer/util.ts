import type { SocialMedia } from '../StoryShareLinks';

export function hasAnySocialMedia(companySocials: SocialMedia.CompanySocials): boolean {
    return Boolean(
        companySocials.facebook ||
            companySocials.instagram ||
            companySocials.linkedin ||
            companySocials.pinterest ||
            companySocials.tiktok ||
            companySocials.twitter ||
            companySocials.youtube,
    );
}
