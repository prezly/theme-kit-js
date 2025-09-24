export type Awaitable<T> = T | Promise<T> | PromiseLike<T>;

export type ExtractPathParams<T extends string> =
    T extends `${infer _Start}(/:${infer Param})/${infer Rest}`
        ? { [k in Param]?: string } & ExtractPathParams<Rest>
        : T extends `${infer _Start}(:${infer Param})/${infer Rest}`
          ? { [k in Param]?: string } & ExtractPathParams<Rest>
          : T extends `${infer _Start}:${infer Param}/${infer Rest}`
            ? { [k in Param]: string } & ExtractPathParams<Rest>
            : T extends `${infer _Start}(/:${infer Param})`
              ? { [k in Param]?: string }
              : T extends `${infer _Start}(:${infer Param})`
                ? { [k in Param]?: string }
                : T extends `${infer _Start}:${infer Param}`
                  ? { [k in Param]: string }
                  : {};
