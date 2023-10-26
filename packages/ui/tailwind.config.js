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
        },
    },
};
