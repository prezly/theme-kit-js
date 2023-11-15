import { twMerge } from 'tailwind-merge';

import { type Breadcrumb, Breadcrumbs } from '../Breadcrumbs';

export function PageTitle({
    title,
    description,
    breadcrumbItems = [],
    className,
}: PageTitle.Props) {
    return (
        <div className={twMerge('container px-6 py-12 sm:p-12 flex flex-col gap-3', className)}>
            <Breadcrumbs className="mb-8" items={breadcrumbItems} />
            <h1 className="title-medium">{title}</h1>
            {description && <p className="subtitle-medium">{description}</p>}
        </div>
    );
}

export namespace PageTitle {
    export interface Props {
        title: string;
        description?: string;
        breadcrumbItems?: Breadcrumb.BreadcrumbItem[];
        className?: string;
    }
}
