export type IntlDictionary = Partial<Record<string, IntlMessageFormat>>;

/**
 * @see https://github.com/formatjs/formatjs/blob/df4f21270320237eb5a91fbf74f3f8f51b4ff184/rust/icu-messageformat-parser/src/ast.rs#L212-L262
 */
enum Type {
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

type VarName = string;

type PluralOption = {
    value: IntlMessageFormat;
};

export type IntlMessageFormat = (
    | { type: Type.LITERAL; value: string }
    | { type: Type.ARGUMENT; value: VarName }
    | {
          type: Type.PLURAL;
          value: VarName;
          pluralType: 'cardinal' | 'ordinal';
          offset: number;
          options: Record<
              'zero' | 'one' | 'two' | 'few' | 'many' | 'other' | `=${number}`,
              PluralOption
          >;
      }
    | { type: Type.POUND }
)[];

export interface IntlMessageDescriptor {
    id: string;
    defaultMessage?: string;
}

export type IntlMessageValues<T> = Record<string, T>;
