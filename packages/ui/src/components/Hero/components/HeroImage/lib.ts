import type { HeroImageSize } from './HeroImage';

function getDesktopImageSize(heroSize: HeroImageSize) {
    switch (heroSize) {
        case 'default':
            return 380;
        default:
            return 600;
    }
}

export function getHeroImageSizes(desiredSize: HeroImageSize) {
    return {
        mobile: 420,
        tablet: desiredSize === 'large' ? 350 : 240,
        desktop: getDesktopImageSize(desiredSize),
        default: 600,
    };
}
