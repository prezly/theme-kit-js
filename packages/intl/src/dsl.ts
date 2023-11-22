type Namespace = string;
type NamespacedId = `${string}` | `${Namespace}.${string}`;

interface IntlMessageDefinition {
    id: NamespacedId;
    defaultMessage?: string;
    description?: string;
}

type IntlDictionaryDefinition = {
    [name: string]: IntlMessageDefinition;
};

export function defineMessages<T extends IntlDictionaryDefinition>(dictionary: T): T {
    return dictionary;
}
