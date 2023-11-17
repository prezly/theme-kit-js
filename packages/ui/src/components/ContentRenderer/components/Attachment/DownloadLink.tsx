import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

import { Button } from '@/components/Button';

export function DownloadLink({ intl = {} }: DownloadLink.Props) {
    return (
        <Button variation="secondary" icon={ArrowUpTrayIcon} iconPlacement="right" size="small">
            {intl['actions.download'] ?? 'Download'}
        </Button>
    );
}

export namespace DownloadLink {
    export interface Intl {
        ['actions.download']: string;
    }

    export interface Props {
        intl?: Partial<Intl>;
    }
}
