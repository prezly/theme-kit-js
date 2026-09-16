export * from './type';
export {
    clearSharedMemoryCache,
    configureSharedMemoryCache,
    createSharedMemoryCache,
    DEFAULT_MAX_BYTES,
    DEFAULT_MAX_RECORDS,
    inspectSharedMemoryCache,
    type MemoryCacheOptions,
} from './memory';
export { createStackedCache } from './stacked';
