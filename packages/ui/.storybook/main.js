import { join, dirname } from 'path';
import { mergeConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import turbosnap from 'vite-plugin-turbosnap';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
    return dirname(require.resolve(join(value, 'package.json')));
}

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        getAbsolutePath('@storybook/addon-links'),
        getAbsolutePath('@storybook/addon-essentials'),
        getAbsolutePath('@storybook/addon-onboarding'),
        getAbsolutePath('@storybook/addon-interactions'),
        getAbsolutePath('@storybook/addon-designs'),
    ],
    framework: {
        name: getAbsolutePath('@storybook/react-vite'),
        options: {},
    },
    docs: {
        autodocs: true,
    },
    viteFinal(config, { configType }) {
        return mergeConfig(config, {
            plugins: [
                configType === 'PRODUCTION' ? turbosnap({ rootDir: process.cwd() }) : undefined,
                tsconfigPaths(),
                svgr(),
            ].filter(Boolean),
            define: {
                'process.env': {},
            },
            resolve: {
                preserveSymlinks: true,
            },
        });
    },
};

export default config;
