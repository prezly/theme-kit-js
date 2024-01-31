import { createStyling, type Theme } from '../../styler';

import type { BaseProps } from './types';

export const defaultTheme: Theme<'button' | 'content' | 'icon', BaseProps> = {
    button: createStyling<BaseProps>(
        'flex items-center justify-center gap-2',
        'border border-transparent bg-transparent',
        // 'focus:ring-4 focus:ring-accent-lighter',
        'focus-visible:ring-4 focus-visible:ring-accent-lighter',
        'leading-[126%]',
        {
            rounded: {
                $off: 'rounded',
                $on: 'rounded-full',
            },
            size: {
                default: 'p-3 label-large',
                small: 'p-2 label-medium',
            },
            variation: {
                primary: [
                    'bg-accent border-accent text-accent-button-text',
                    'hover:bg-accent-dark hover:border-accent-dark',
                    // 'focus:bg-accent-dark focus:border-transparent',
                    'focus-visible:bg-accent-dark focus-visible:border-transparent',
                    'active:bg-accent-dark active:border-accent-dark',
                    'disabled:bg-accent-lighter disabled:border-transparent disabled:opacity-50',
                ],
                secondary: [
                    'bg-white border-gray-200 text-gray-800',
                    'hover:bg-gray-50 hover:border-gray-300',
                    // 'focus:bg-gray-50 focus:border-transparent',
                    'focus-visible:bg-gray-50 focus-visible:border-transparent',
                    'active:bg-gray-100 active:border-gray-400',
                    'disabled:bg-white disabled:border-transparent disabled:text-gray-400',
                ],
                navigation: [
                    'p-0 bg-white text-gray-800',
                    'hover:text-gray-900',
                    // 'focus:text-gray-950',
                    'focus-visible:text-gray-950',
                    'disabled:bg-white disabled:text-gray-400',
                ],
            },
        },
    ),
    content: createStyling<BaseProps>('first:ml-1 last:mr-1 empty:hidden'),
    icon: () => '',
};
