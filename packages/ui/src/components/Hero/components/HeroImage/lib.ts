import type { HeroImage } from './HeroImage';

function getDesktopImageSize(heroSize: HeroImage.Size) {
    switch (heroSize) {
        case 'default':
            return 380;
        default:
            return 600;
    }
}

export function getHeroImageSizes(desiredSize: HeroImage.Size) {
    return {
        mobile: 420,
        tablet: desiredSize === 'large' ? 350 : 240,
        desktop: getDesktopImageSize(desiredSize),
        default: 600,
    };
}
