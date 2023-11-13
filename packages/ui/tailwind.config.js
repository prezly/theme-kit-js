/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{ts,tsx,mdx}'],
    darkMode: ['class', '[data-mode="dark"]'],
    theme: {
        extend: {
            colors: {
                success: '#12B76A',
                warning: '#FDB022',
                error: '#F04438',
                accent: {
                    DEFAULT: 'var(--prezly-accent-color)',
                    dark: 'var(--prezly-accent-color-dark)',
                    darker: 'var(--prezly-accent-color-darker)',
                    light: 'var(--prezly-accent-color-light)',
                    lighter: 'var(--prezly-accent-color-lighter)',
                    'button-text': 'var(--prezly-accent-color-button-text)',
                },
                header: {
                    link: 'var(--prezly-header-link-color)',
                    'link-hover': 'var(--prezly-header-link-color-hover)',
                },
                placeholder: {
                    DEFAULT: 'var(--prezly-placeholder-background-color)',
                },
            },
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                xSmall: '0px 1px 2px 0px rgba(31, 41, 55, 0.05)',
                small: '0px 1px 2px 0px rgba(31, 41, 55, 0.06), 0px 1px 3px 0px rgba(31, 41, 55, 0.10)',
                medium: '0px 2px 4px -2px rgba(31, 41, 55, 0.06), 0px 4px 8px -2px rgba(31, 41, 55, 0.10)',
                large: '0px 4px 6px -2px rgba(31, 41, 55, 0.03), 0px 12px 16px -4px rgba(31, 41, 55, 0.08)',
                xLarge: '0px 8px 8px -4px rgba(31, 41, 55, 0.03), 0px 20px 24px -4px rgba(31, 41, 55, 0.08)',
                xxLarge: '0px 24px 48px -12px rgba(31, 41, 55, 0.18)',
            },
        },
    },
};
