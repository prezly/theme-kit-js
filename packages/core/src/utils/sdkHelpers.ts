/**
 * These helpers and enums are ported from @prezly/sdk to avoid leaking the dependency into the client bundle.
 * The types are matching SDK v15.
 */

import type { Story } from '@prezly/sdk';

export enum Visibility {
    PUBLIC = 'public',
    EMBARGO = 'embargo',
    PRIVATE = 'private',
    CONFIDENTIAL = 'confidential',
}

export enum Status {
    UNINITIALIZED = 'uninitialized',
    DRAFT = 'draft',
    SCHEDULED = 'scheduled',
    EMBARGO = 'embargo',
    PUBLISHED = 'published',
}

export enum FormatVersion {
    HTML = 1,
    SLATEJS = 3,
}

/**
 * @see https://github.com/prezly/javascript-sdk/blob/8c735968415ded334f60635a8cef66f76a20a73f/src/types/Story.ts#L337
 */
export function isStoryPublished(status: Status): boolean;
export function isStoryPublished(story: Pick<Story, 'status'>): boolean;
export function isStoryPublished(arg: Status | Pick<Story, 'status'>): boolean {
    if (typeof arg === 'object' && arg !== null) {
        return isStoryPublished(arg.status);
    }
    return arg === Status.PUBLISHED;
}

/**
 * @see https://github.com/prezly/javascript-sdk/blob/8c735968415ded334f60635a8cef66f76a20a73f/src/types/Story.ts#L328
 */
export function isScheduledEmbargo(status: Status): boolean;
export function isScheduledEmbargo(story: Pick<Story, 'status'>): boolean;
export function isScheduledEmbargo(arg: Status | Pick<Story, 'status'>): boolean {
    if (typeof arg === 'object' && arg !== null) {
        return isScheduledEmbargo(arg.status);
    }
    return arg === Status.EMBARGO;
}
