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
            },
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
