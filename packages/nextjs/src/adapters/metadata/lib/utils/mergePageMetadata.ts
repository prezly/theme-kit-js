/* eslint-disable @typescript-eslint/no-use-before-define */
import { omitUndefined } from '@technically/omit-undefined';
import type { Metadata } from 'next';

export function mergePageMetadata(...metadatas: Metadata[]): Metadata {
    return metadatas.reduce((merged, metadata) => merge(merged, metadata), {});
}

function merge(a: Metadata, b: Metadata): Metadata {
    if (Object.keys(a).length === 0) {
        return omitUndefined(b);
    }

    if (Object.keys(b).length === 0) {
        return omitUndefined(a);
    }

    return omitUndefined({
        ...omitUndefined(a),
        ...omitUndefined(b),
        robots: mergeRobots(a.robots, b.robots),
        alternates: mergeAlternates(a.alternates, b.alternates),
        openGraph: {
            ...omitUndefined(a.openGraph ?? {}),
            ...omitUndefined(b.openGraph ?? {}),
        },
        twitter: {
            ...omitUndefined(a.twitter ?? {}),
            ...omitUndefined(b.twitter ?? {}),
        },
        verification: {
            ...omitUndefined(a.verification ?? {}),
            ...omitUndefined(b.verification ?? {}),
        },
        other: {
            ...omitUndefined(a.other ?? {}),
            ...omitUndefined(b.other ?? {}),
        },
    });
}

function mergeRobots(a: Metadata['robots'], b: Metadata['robots']): Metadata['robots'] {
    if (a && typeof a === 'object' && b && typeof b === 'object') {
        return {
            ...omitUndefined(a),
            ...omitUndefined(b),
        };
    }

    return b || a;
}

function mergeAlternates(
    a: Metadata['alternates'],
    b: Metadata['alternates'],
): Metadata['alternates'] {
    return {
        ...omitUndefined(a ?? {}),
        ...omitUndefined(b ?? {}),
        media: {
            ...omitUndefined(a?.media ?? {}),
            ...omitUndefined(b?.media ?? {}),
        },
        types: {
            ...omitUndefined(a?.types ?? {}),
            ...omitUndefined(b?.types ?? {}),
        },
    };
}
