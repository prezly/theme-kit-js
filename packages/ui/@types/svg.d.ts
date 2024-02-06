declare module '*.svg' {
    import type * as React from 'react';

    const ReactComponent: React.FunctionComponent<React.ComponentProps<'svg'> & { title?: string }>;

    // eslint-disable-next-line import/no-default-export
    export default ReactComponent;
}
