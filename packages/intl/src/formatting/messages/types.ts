export type IntlDictionary = Partial<Record<string, IntlMessageFormat>>;

type VarName = string;

export type IntlMessageFormat = (
    | { type: IntlMessageFormat.Type.LITERAL; value: string }
    | { type: IntlMessageFormat.Type.ARGUMENT; value: VarName }
    | {
          type: IntlMessageFormat.Type.PLURAL;
          value: VarName;
          pluralType: 'cardinal' | 'ordinal';
          offset: number;
          options: Partial<
              Record<
                  'zero' | 'one' | 'two' | 'few' | 'many' | `=${number}`,
                  { value: IntlMessageFormat }
              >
          > & { other: { value: IntlMessageFormat } };
      }
    | { type: IntlMessageFormat.Type.POUND }
)[];

export namespace IntlMessageFormat {
    /**
     * @see https://github.com/formatjs/formatjs/blob/df4f21270320237eb5a91fbf74f3f8f51b4ff184/rust/icu-messageformat-parser/src/ast.rs#L212-L262
     */
    export enum Type {
        /**
         * Raw text
         */
        LITERAL = 0,
        /**
         * Variable without any format, e.g. `var` in `this is a {var}`
         */
        ARGUMENT = 1,
        // NUMBER = 2, // Not implemented
        // DATE = 3, // Not implemented
        // TIME = 4, // Not implemented
        // SELECT = 5, // Not implemented
        /**
         * Variable with plural format
         */
        PLURAL = 6,
        /**
         * Only possible within plural argument.
         * This is the `#` symbol that will be substituted with the count.
         */
        POUND = 7,
        // TAG = 8, // Not implemented
    }
}

export interface IntlMessageDescriptor {
    id: string;
    defaultMessage?: string;
}

export type IntlMessageValues<T> = Record<string, T>;
