import type { NewsroomContextProps } from './newsroom-context/index.js';

export interface ServerSidePageProps {
    /**
     * Indicates whether the locale requested by the Next application was correctly resolved to an active newsroom locale.
     * This is used by `processRequest` method to redirect to the default locale if the property is `false`.
     */
    localeResolved: boolean;
}

/**
 * These are the props returned by the `processRequest` method that are meant to be passed to your `_app` to be injected into the `NewsroomContextProvider`.
 */
export interface PageProps {
    newsroomContextProps: NewsroomContextProps;
}
