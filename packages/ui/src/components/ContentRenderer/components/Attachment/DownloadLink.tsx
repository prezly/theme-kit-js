import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

import { Button } from '@/components/Button';

export function DownloadLink() {
    return (
        <Button variation="secondary" icon={ArrowUpTrayIcon} iconPlacement="right" size="small">
            {/* TODO: Add translations */}
            Download
        </Button>
    );
}
