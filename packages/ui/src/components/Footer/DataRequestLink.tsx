export function DataRequestLink({
    className,
    privacyRequestLink,
    intl = {},
}: DataRequestLink.Props) {
    return (
        <a href={privacyRequestLink} className={className}>
            {intl['actions.privacyRequests'] ?? 'Privacy requests'}
        </a>
    );
}

export namespace DataRequestLink {
    export interface Intl {
        ['actions.privacyRequests']: string;
    }

    export interface Props {
        className?: string;
        privacyRequestLink: string;
        intl?: Partial<Intl>;
    }
}
