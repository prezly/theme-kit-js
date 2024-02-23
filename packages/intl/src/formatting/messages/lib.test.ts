/* eslint-disable @typescript-eslint/no-use-before-define */
import { formatMessageFragment, formatMessageString, parseMessage, tokenizeMessage } from './lib';
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
    [`images.count`]: [
        {
            type: 0,
            value: 'Images: ',
        },
        {
            offset: 0,
            options: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '=0': {
                    value: [
                        {
                            type: 0,
                            value: 'no images',
                        },
                    ],
                },
                one: {
                    value: [
                        {
                            type: 7,
                        },
                        {
                            type: 0,
                            value: ' image',
                        },
                    ],
                },
                other: {
                    value: [
                        {
                            type: 7,
                        },
                        {
                            type: 0,
                            value: ' images',
                        },
                    ],
                },
            },
            pluralType: 'cardinal',
            type: 6,
            value: 'imagesCount',
        },
    ],
};

describe('formatMessageString', () => {
    it('should format intl-generated message intl object using the given values', () => {
        const formatted = formatMessageString(
            'en',
            { id: 'hello.world', defaultMessage: 'Hello, {name}!' },
            I18N,
            { name: 'Julio' },
        );

        expect(formatted).toBe('¡Hola, Julio!');
    });

    it('should leave placeholders if the given values object does not have enough data', () => {
        const formatted = formatMessageString(
            'en',
            { id: 'hello.world', defaultMessage: 'Hello, {name}!' },
            I18N,
            {},
        );

        expect(formatted).toBe('¡Hola, {name}!');
    });

    it('should fallback to the default message if the dictionary does not have it', () => {
        const formatted = formatMessageString(
            'en',
            { id: 'hello.world', defaultMessage: 'Hello, {name}!' },
            {},
            { name: 'Julio' },
        );

        expect(formatted).toBe('Hello, Julio!');
    });

    it('should format pluralization placeholders', () => {
        function format(imagesCount: number) {
            return formatMessageString(
                'en',
                { id: 'images.count', defaultMessage: 'default' },
                I18N,
                {
                    imagesCount,
                },
            );
        }

        expect(format(0)).toBe('Images: no images');
        expect(format(1)).toBe('Images: 1 image');
        expect(format(1024)).toBe('Images: 1024 images');
    });

    it('should do the most minimal support for pluralization placeholders in default messages', () => {
        function format(imagesCount: number) {
            return formatMessageString(
                'en',
                {
                    id: 'images.count',
                    defaultMessage: 'Images: {imagesCount, plural, other {IDK}}',
                },
                {},
                {
                    imagesCount,
                },
            );
        }

        expect(format(0)).toEqual('Images: 0');
        expect(format(1)).toEqual('Images: 1');
        expect(format(1024)).toEqual('Images: 1024');
    });
});

describe('formatMessageFragment', () => {
    it('should format intl-generated message intl object using the given values', () => {
        const formatted = formatMessageFragment(
            'en',
            { id: 'hello.world', defaultMessage: 'Hello, {name}!' },
            I18N,
            { name: createElement('strong', ['Julio']) },
        );

        expect(formatted).toEqual(['¡Hola, ', { type: 'strong', children: ['Julio'] }, '!']);
    });

    it('should leave placeholders if the given values object does not have enough data', () => {
        const formatted = formatMessageFragment(
            'en',
            { id: 'hello.world', defaultMessage: 'Hello, {name}!' },
            I18N,
            {},
        );

        expect(formatted).toEqual(['¡Hola, ', '{name}', '!']);
    });

    it('should fallback to the default message if the dictionary does not have it', () => {
        const formatted = formatMessageFragment(
            'en',
            { id: 'hello.world', defaultMessage: 'Hello, {name}!' },
            {},
            { name: createElement('strong', ['Julio']) },
        );

        expect(formatted).toEqual(['Hello, ', { type: 'strong', children: ['Julio'] }, '!']);
    });

    it('should format pluralization placeholders', () => {
        function format(imagesCount: number) {
            return formatMessageFragment(
                'en',
                { id: 'images.count', defaultMessage: 'default' },
                I18N,
                {
                    imagesCount,
                },
            );
        }

        expect(format(0)).toEqual(['Images: ', 'no images']);
        expect(format(1)).toEqual(['Images: ', '1', ' image']);
        expect(format(1024)).toEqual(['Images: ', '1024', ' images']);
    });

    it('should do the most minimal support for pluralization placeholders in default messages', () => {
        function format(imagesCount: number) {
            return formatMessageFragment(
                'en',
                {
                    id: 'images.count',
                    defaultMessage: 'Images: {imagesCount, plural, other {IDK}}',
                },
                {},
                {
                    imagesCount,
                },
            );
        }

        expect(format(0)).toEqual(['Images: ', 0]);
        expect(format(1)).toEqual(['Images: ', 1]);
        expect(format(1024)).toEqual(['Images: ', 1024]);
    });
});

describe('parseMessage', () => {
    it('should parse literal string', () => {
        const parsed = parseMessage('Hello world!');
        expect(parsed).toEqual([{ type: 0, value: 'Hello world!' }]);
    });

    it('should parse argument placeholders', () => {
        const parsed = parseMessage('Hello {name}!');
        expect(parsed).toEqual([
            { type: 0, value: 'Hello ' },
            { type: 1, value: 'name' },
            { type: 0, value: '!' },
        ]);
    });

    it('should partially parse plural placeholders as a last resort fallback', () => {
        const parsed = parseMessage(
            '{apples, plural, zero {There are no apples}, one {There is one apple}, other {There are # apples}}',
        );
        expect(parsed).toEqual([{ type: 1, value: 'apples' }]);
    });
});

describe('tokenizeMessage', () => {
    it('should return a single item array for literal strings', () => {
        const tokens = tokenizeMessage('Hello world');
        expect(tokens).toEqual(['Hello world']);
    });

    it('it should tokenize simple placeholders', () => {
        const tokens = tokenizeMessage('Hello {type} world of {creatures}!');
        expect(tokens).toEqual(['Hello ', '{type}', ' world of ', '{creatures}', '!']);
    });

    it('it should tokenize pluralization placeholders', () => {
        const tokens = tokenizeMessage(
            'Hello {type} world of {count, plural, other {#}} {creatures}!',
        );
        expect(tokens).toEqual([
            'Hello ',
            '{type}',
            ' world of ',
            '{count, plural, other {#}}',
            ' ',
            '{creatures}',
            '!',
        ]);
    });
});

/**
 * Emulating React.createElement for test purposes.
 */
function createElement(type: string, children: string[]) {
    return { type, children };
}
