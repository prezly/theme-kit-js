import type { StoryImage } from './StoryImage';

function getDesktopImageSize(imageSize: StoryImage.Size) {
    switch (imageSize) {
        case 'tiny':
            return 200;
        default:
            return 528;
    }
}

export function getHeroImageSizes(desiredSize: StoryImage.Size) {
    return {
        mobile: 420,
        tablet: desiredSize === 'large' ? 350 : 240,
        desktop: getDesktopImageSize(desiredSize),
        default: 600,
    };
}
