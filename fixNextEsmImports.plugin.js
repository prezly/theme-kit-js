import babelCore from '@babel/core';

const { importDeclaration, stringLiteral } = babelCore.types;

export default function () {
    return {
        visitor: {
            ImportDeclaration: (path) => {
                const { node } = path;
                const { source, exportKind, importKind } = node;

                const isTypeOnly = exportKind === 'type' || importKind === 'type';

                if (!source || isTypeOnly) {
                    return;
                }

                const module = source && source.value;

                if (!module.startsWith('next/') || module.endsWith('.js')) {
                    return;
                }

                path.replaceWith(importDeclaration(node.specifiers, stringLiteral(`${module}.js`)));
            },
        },
    };
}
