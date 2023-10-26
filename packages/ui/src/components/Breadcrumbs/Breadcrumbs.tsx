import { Breadcrumb, type BreadcrumbItem } from './components';

export interface Props {
    items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: Props) {
    return (
        <nav>
            <ol className="flex items-center gap-2">
                {items.map((item, index) => (
                    <Breadcrumb key={item.url} item={item} isLast={index === items.length - 1} />
                ))}
            </ol>
        </nav>
    );
}
