/* eslint-disable @typescript-eslint/no-use-before-define,@typescript-eslint/no-redeclare */

export type Resolvable<T> = T | DynamicallyResolvable<T>;
export type AsyncResolvable<T> = T | DynamicallyResolvable<T> | AsyncDynamicallyResolvable<T>;

type Awaitable<T> = T | Promise<T>;
type DynamicallyResolvable<T> = () => T;
type AsyncDynamicallyResolvable<T> = () => Promise<T>;

export namespace Resolvable {
    export type Properties<T> = {
        [key in keyof T]: Resolvable<T[key]>;
    };

    export function resolve<T>(value: T | DynamicallyResolvable<T>): T {
        if (typeof value === 'function') {
            return (value as DynamicallyResolvable<T>)();
        }
        return value;
    }
}

export namespace AsyncResolvable {
    export type Properties<T> = {
        [key in keyof T]: AsyncResolvable<T[key]>;
    };

    export function resolve<T>(value: AsyncResolvable<T>): Awaitable<T>;

    export function resolve<T extends any[]>(
        ...values: { [K in keyof T]: AsyncResolvable<T[K]> }
    ): Promise<{ [K in keyof T]: T[K] }>;

    export function resolve<T extends any[]>(
        ...values: { [K in keyof T]: AsyncResolvable<T[K]> }
    ): Awaitable<T> | Promise<{ [K in keyof T]: T[K] }> {
        if (values.length === 1) {
            return resolveAsyncOne(values[0]) as Awaitable<T[0]>;
        }

        const resolutions = values.map((value) => resolveAsyncOne(value));
        return Promise.all(resolutions) as Promise<{ [K in keyof T]: T[K] }>;
    }
}

function resolveAsyncOne<T>(value: AsyncResolvable<T>): Awaitable<T> {
    if (typeof value === 'function') {
        return Promise.resolve((value as AsyncDynamicallyResolvable<T>)());
    }
    return value;
}
