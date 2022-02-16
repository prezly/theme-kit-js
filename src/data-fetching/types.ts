export interface AlgoliaSettings {
    ALGOLIA_API_KEY: string;
    ALGOLIA_APP_ID: string;
    ALGOLIA_INDEX: string;
}

export interface PrezlyNewsroomEnv {
    PREZLY_ACCESS_TOKEN: string;
    PREZLY_NEWSROOM_UUID: string;
    PREZLY_THEME_UUID?: string;
}

export interface PrezlyEnv extends PrezlyNewsroomEnv, AlgoliaSettings {}
