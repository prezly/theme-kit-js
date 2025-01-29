import type { JSX as Jsx } from 'react/jsx-runtime';

export declare global {
    namespace JSX {
        type ElementClass = Jsx.ElementClass;
        type Element = Jsx.Element;
        type IntrinsicElements = Jsx.IntrinsicElements;
    }
}
