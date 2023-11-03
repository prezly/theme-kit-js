import { useMediaQuery } from '@react-hookz/web';

/**
 * Values kept in sync with tailwindcss breakpoints
 */
const BREAKPOINT_SM = 640;
const BREAKPOINT_MD = 768;
const BREAKPOINT_LG = 1024;
const BREAKPOINT_XL = 1280;
const BREAKPOINT_2XL = 1536;

export function useDevice() {
    const isSm = useMediaQuery(`(min-width: ${BREAKPOINT_SM}px)`, {
        initializeWithValue: true,
    });
    const isMd = useMediaQuery(`(min-width: ${BREAKPOINT_MD}px)`, {
        initializeWithValue: true,
    });
    const isLg = useMediaQuery(`(min-width: ${BREAKPOINT_LG}px)`, {
        initializeWithValue: true,
    });
    const isXl = useMediaQuery(`(min-width: ${BREAKPOINT_XL}px)`, {
        initializeWithValue: true,
    });
    const is2Xl = useMediaQuery(`(min-width: ${BREAKPOINT_2XL}px)`, {
        initializeWithValue: true,
    });

    return { isSm, isMd, isLg, isXl, is2Xl };
}
