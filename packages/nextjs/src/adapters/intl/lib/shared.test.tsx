import renderer from 'react-test-renderer';

import { formatMessageFragment, formatMessageString } from './shared';
import type { IntlDictionary } from './types';

const INTL: IntlDictionary = {
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
            INTL,
            { id: 'hello.world', defaultMessage: 'Hello, {name}!' },
            { name: 'Julio' },
        );

        expect(formatted).toBe('¡Hola, Julio!');
    });

    it('should leave placeholders if the given values object does not have enough data', () => {
        const formatted = formatMessageString(
            INTL,
            { id: 'hello.world', defaultMessage: 'Hello, {name}!' },

            {},
        );

        expect(formatted).toBe('¡Hola, {name}!');
    });

    it('should fallback to the default message if the dictionary does not have it', () => {
        const formatted = formatMessageString(
            {},
            { id: 'hello.world', defaultMessage: 'Hello, {name}!' },
            { name: 'Julio' },
        );

        expect(formatted).toBe('Hello, Julio!');
    });
});

describe('formatMessageFragment', () => {
    it('should format intl-generated message intl object using the given values', () => {
        const formatted = formatMessageFragment(
            INTL,
            { id: 'hello.world', defaultMessage: 'Hello, {name}!' },
            { name: <strong>Julio</strong> },
        );

        expect(renderer.create(formatted).toJSON()).toMatchSnapshot();
    });

    it('should leave placeholders if the given values object does not have enough data', () => {
        const formatted = formatMessageFragment(
            INTL,
            { id: 'hello.world', defaultMessage: 'Hello, {name}!' },
            {},
        );

        expect(renderer.create(formatted).toJSON()).toMatchSnapshot();
    });

    it('should fallback to the default message if the dictionary does not have it', () => {
        const formatted = formatMessageFragment(
            {},
            { id: 'hello.world', defaultMessage: 'Hello, {name}!' },
            { name: <strong>Julio</strong> },
        );

        expect(renderer.create(formatted).toJSON()).toMatchSnapshot();
    });
});
