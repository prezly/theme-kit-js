import type { PrezlyEnv } from '@prezly/theme-kit-core';

declare global {
    export namespace NodeJS {
        export interface ProcessEnv extends PrezlyEnv {}
    }
}
