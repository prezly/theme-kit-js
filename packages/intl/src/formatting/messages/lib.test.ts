/* eslint-disable @typescript-eslint/no-use-before-define */
import { expect } from '@playwright/test';

import { formatMessageFragment, formatMessageString } from './lib';
import type { IntlDictionary } from './types';

const I18N: IntlDictionary = {
    [`hello.world`]: [
        {
            type: 0,
            value: '¡Hola, ',
        },
        {
            type: 1,
            value: 'name',
        },
        {
            type: 0,
            value: '!',
        },
    ],
};

describe('formatMessageString', () => {
    it('should format intl-generated message intl object using the given values', () => {
        const formatted = formatMessageString(
            { id: 'hello.world', defaultMessage: 'Hello, {name}!' },
            I18N,
            { name: 'Julio' },
        );

        expect(formatted).toBe('¡Hola, Julio!');
    });

    it('should leave placeholders if the given values object does not have enough data', () => {
        const formatted = formatMessageString(
            { id: 'hello.world', defaultMessage: 'Hello, {name}!' },
            I18N,
            {},
        );

        expect(formatted).toBe('¡Hola, {name}!');
    });

    it('should fallback to the default message if the dictionary does not have it', () => {
        const formatted = formatMessageString(
            { id: 'hello.world', defaultMessage: 'Hello, {name}!' },
            {},
            { name: 'Julio' },
        );

        expect(formatted).toBe('Hello, Julio!');
    });
});

describe('formatMessageFragment', () => {
    it('should format intl-generated message intl object using the given values', () => {
        const formatted = formatMessageFragment(
            { id: 'hello.world', defaultMessage: 'Hello, {name}!' },
            I18N,
            { name: createElement('strong', ['Julio']) },
        );

        expect(formatted).toEqual(['¡Hola, ', { type: 'strong', children: ['Julio'] }, '!']);
    });

    it('should leave placeholders if the given values object does not have enough data', () => {
        const formatted = formatMessageFragment(
            { id: 'hello.world', defaultMessage: 'Hello, {name}!' },
            I18N,
            {},
        );

        expect(formatted).toEqual(['¡Hola, ', '{name}', '!']);
    });

    it('should fallback to the default message if the dictionary does not have it', () => {
        const formatted = formatMessageFragment(
            { id: 'hello.world', defaultMessage: 'Hello, {name}!' },
            {},
            { name: createElement('strong', ['Julio']) },
        );

        expect(formatted).toEqual(['Hello, ', { type: 'strong', children: ['Julio'] }, '!']);
    });
});

/**
 * Emulating React.createElement for test purposes.
 */
function createElement(type: string, children: string[]) {
    return { type, children };
}
