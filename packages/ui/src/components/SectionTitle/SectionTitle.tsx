import { twMerge } from 'tailwind-merge';

export function SectionTitle({ title, description, className }: SectionTitle.Props) {
    return (
        <div className={twMerge('container px-6 sm:px-12 py-6 flex flex-col gap-3', className)}>
            <h2 className="title-medium">{title}</h2>
            {description && <p className="subtitle-medium">{description}</p>}
        </div>
    );
}

export namespace SectionTitle {
    export interface Props {
        title: string;
        description?: string;
        className?: string;
    }
}
