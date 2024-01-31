import { expect } from '@playwright/test';

import { createStyling } from './styling';

describe('createStyling', () => {
    it('should create a styling function', () => {
        const styling = createStyling('hello');
        expect(typeof styling).toBe('function');
    });

    it('should compile plain string class names list', () => {
        const styling = createStyling('hello world');
        expect(styling()).toBe('hello world');
    });

    it('should compile list of class names strings', () => {
        const styling = createStyling('hello world', 'this is me');
        expect(styling()).toBe('hello world this is me');
    });

    it('should compile arrays of class names strings', () => {
        const styling = createStyling(
            ['hello world', 'this is me'],
            ['how about', 'another list', ['with', 'nested', 'values']],
        );
        expect(styling()).toBe('hello world this is me how about another list with nested values');
    });

    it('should compile mapping of enum props to class names', () => {
        const styling = createStyling<{ size: 'small' | 'large' }>('hello world', 'this is me', {
            size: {
                small: 'small size',
                large: 'large size',
            },
        });
        expect(styling({ size: 'large' })).toBe('hello world this is me large size');
    });

    it('should compile on/off mapping of enum props to class names', () => {
        const styling = createStyling<{ size: 'small' | 'large' }>('hello world', 'this is me', {
            size: {
                $on: 'size-present',
                small: 'small-size',
                large: 'large-size',
            },
        });
        expect(styling({ size: 'large' })).toBe('hello world this is me size-present large-size');
    });

    it('should compile on/off mapping for boolean props to class names', () => {
        const styling = createStyling<{ loading: boolean }>('hello world', 'this is me', {
            loading: {
                $on: 'loading',
                $off: 'not-loading',
            },
        });
        expect(styling({ loading: true })).toBe('hello world this is me loading');
        expect(styling({ loading: false })).toBe('hello world this is me not-loading');
    });

    it('should deduplicate classes with tailwind-merge', () => {
        const styling = createStyling('p-1', 'p-5');
        expect(styling()).toBe('p-5');
    });
});
