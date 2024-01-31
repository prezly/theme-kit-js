import { expect } from '@playwright/test';

import type { Theme } from './theming';
import { extendTheme } from './theming';

describe('extendTheme', () => {
    it('should extend an existing theme with additional class names', () => {
        const theme: Theme<'button' | 'content'> = {
            button: () => 'p-5 flex',
            content: () => 'text-large',
        };

        const extended = extendTheme(theme, {
            button: 'bg-primary',
        });

        expect(extended.button()).toBe('p-5 flex bg-primary');
        expect(extended.content()).toBe('text-large');
    });

    it('should extend an existing theme with dynamic functions returning class names', () => {
        type Props = { size: 'small' | 'medium' };

        const theme: Theme<'button' | 'content', Props> = {
            button: () => 'p-5 flex',
            content: () => 'text-large',
        };

        const extended = extendTheme(theme, {
            button: ({ size }) => ['m-5', size],
        });

        expect(extended.button({ size: 'small' })).toBe('p-5 flex m-5 small');
        expect(extended.content({ size: 'small' })).toBe('text-large');
    });

    it('should apply theme extension deduplicating class names with tailwind-merge', () => {
        type Props = { size: 'small' | 'medium' };

        const theme: Theme<'button' | 'content', Props> = {
            button: () => 'p-5 bg-primary',
            content: () => 'text-large',
        };

        const extended = extendTheme(theme, {
            button: ({ size }) => ['p-6', size],
        });

        expect(extended.button()).toBe('bg-primary p-6');

        expect(extended.button({ size: 'small' }, 'bg-secondary')).toBe('p-6 small bg-secondary');
    });
});
