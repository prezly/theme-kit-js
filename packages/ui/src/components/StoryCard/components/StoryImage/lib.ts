import type { StoryImageSize } from './StoryImage';

function getDesktopImageSize(imageSize: StoryImageSize) {
    switch (imageSize) {
        case 'tiny':
            return 200;
        default:
            return 528;
    }
}

export function getHeroImageSizes(desiredSize: StoryImageSize) {
    return {
        mobile: 420,
        tablet: desiredSize === 'large' ? 350 : 240,
        desktop: getDesktopImageSize(desiredSize),
        default: 600,
    };
}
