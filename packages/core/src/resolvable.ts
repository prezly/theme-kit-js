/* eslint-disable @typescript-eslint/no-use-before-define,@typescript-eslint/no-redeclare */

export type Resolvable<T> = T | DynamicallyResolvable<T>;
export type AsyncResolvable<T> = T | DynamicallyResolvable<T> | AsyncDynamicallyResolvable<T>;

type Awaitable<T> = T | Promise<T>;
type DynamicallyResolvable<T> = () => T;
type AsyncDynamicallyResolvable<T> = () => Promise<T>;

export namespace Resolvable {
    export function resolve<T>(value: T | DynamicallyResolvable<T>): T {
        if (typeof value === 'function') {
            return (value as DynamicallyResolvable<T>)();
        }
        return value;
    }
}

export namespace AsyncResolvable {
    export function resolve<T>(
        value: T | DynamicallyResolvable<T> | AsyncDynamicallyResolvable<T>,
    ): Awaitable<T>;

    export function resolve<T1, T2>(
        ...values: [AsyncResolvable<T1>, AsyncResolvable<T2>]
    ): Promise<[T1, T2]>;

    export function resolve<T1, T2, T3>(
        ...values: [AsyncResolvable<T1>, AsyncResolvable<T2>, AsyncResolvable<T3>]
    ): Promise<[T1, T2, T3]>;

    export function resolve<T1, T2, T3, T4>(
        ...values: [
            AsyncResolvable<T1>,
            AsyncResolvable<T2>,
            AsyncResolvable<T3>,
            AsyncResolvable<T4>,
        ]
    ): Promise<[T1, T2, T3, T4]>;

    export function resolve<T1, T2, T3, T4, T5>(
        ...values: [
            AsyncResolvable<T1>,
            AsyncResolvable<T2>,
            AsyncResolvable<T3>,
            AsyncResolvable<T4>,
            AsyncResolvable<T5>,
        ]
    ): Promise<[T1, T2, T3, T4, T5]>;

    export function resolve<T1, T2, T3, T4, T5, T6>(
        ...values: [
            AsyncResolvable<T1>,
            AsyncResolvable<T2>,
            AsyncResolvable<T3>,
            AsyncResolvable<T4>,
            AsyncResolvable<T5>,
            AsyncResolvable<T6>,
        ]
    ): Promise<[T1, T2, T3, T4, T5, T6]>;

    export function resolve<T1, T2, T3, T4, T5, T6, T7>(
        ...values: [
            AsyncResolvable<T1>,
            AsyncResolvable<T2>,
            AsyncResolvable<T3>,
            AsyncResolvable<T4>,
            AsyncResolvable<T5>,
            AsyncResolvable<T6>,
            AsyncResolvable<T7>,
        ]
    ): Promise<[T1, T2, T3, T4, T5, T6, T7]>;

    export function resolve<T1, T2, T3, T4, T5, T6, T7, T8>(
        ...values: [
            AsyncResolvable<T1>,
            AsyncResolvable<T2>,
            AsyncResolvable<T3>,
            AsyncResolvable<T4>,
            AsyncResolvable<T5>,
            AsyncResolvable<T6>,
            AsyncResolvable<T7>,
            AsyncResolvable<T8>,
        ]
    ): Promise<[T1, T2, T3, T4, T5, T6, T7, T8]>;

    export function resolve<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
        ...values: [
            AsyncResolvable<T1>,
            AsyncResolvable<T2>,
            AsyncResolvable<T3>,
            AsyncResolvable<T4>,
            AsyncResolvable<T5>,
            AsyncResolvable<T6>,
            AsyncResolvable<T7>,
            AsyncResolvable<T8>,
            AsyncResolvable<T9>,
        ]
    ): Promise<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;

    export function resolve<T>(...values: AsyncResolvable<T>[]): Awaitable<T> | Promise<T[]> {
        if (values.length === 1) {
            const [value] = values;
            return resolveAsyncOne(value);
        }

        const resolutions = values.map((value) => resolveAsyncOne(value));
        return Promise.all(resolutions);
    }
}

function resolveAsyncOne<T>(value: AsyncResolvable<T>): Awaitable<T> {
    if (typeof value === 'function') {
        return Promise.resolve((value as AsyncDynamicallyResolvable<T>)());
    }
    return value;
}
