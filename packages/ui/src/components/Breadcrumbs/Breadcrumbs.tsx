import { Breadcrumb } from './components';

export function Breadcrumbs({ items, className }: Breadcrumbs.Props) {
    if (items.length === 0) {
        return null;
    }

    return (
        <nav className={className}>
            <ol className="flex items-center gap-2">
                {items.map((item, index) => (
                    <Breadcrumb key={item.url} item={item} isLast={index === items.length - 1} />
                ))}
            </ol>
        </nav>
    );
}

export namespace Breadcrumbs {
    export interface Props {
        items: Breadcrumb.BreadcrumbItem[];
        className?: string;
    }
}
