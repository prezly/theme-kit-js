import type { PrezlyEnv } from '../data-fetching';

declare global {
    export namespace NodeJS {
        export interface ProcessEnv extends PrezlyEnv {}
    }
}
