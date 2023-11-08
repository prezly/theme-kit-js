import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    plugins: [
        react(),
        dts({
            insertTypesEntry: true,
        }),
        tsconfigPaths(),
        svgr(),
    ],
    resolve: {
        preserveSymlinks: true,
    },
    build: {
        outDir: 'build',
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'theme-kit-ui',
            formats: ['es', 'cjs'],
            fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
});
