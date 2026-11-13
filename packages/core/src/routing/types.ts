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
                  : // A named wildcard at the end takes every segment that is left: `/category/*path`.
                    T extends `${infer _Start}*${infer Param}`
                    ? { [k in Param]: string }
                    : {};
