'use client';

import { STORY_FILE, useAnalytics } from '@prezly/analytics-nextjs';
import type { AttachmentNode } from '@prezly/story-content-format';
import { UploadcareFile } from '@prezly/uploadcare';

import { DownloadLink } from './DownloadLink';
import { FileTypeIcon } from './FileTypeIcon';
import { formatBytes } from './utils';

interface Props {
    node: AttachmentNode;
}

export function Attachment({ node }: Props) {
    const { track } = useAnalytics();
    const { file, description } = node;
    const { downloadUrl } = UploadcareFile.createFromPrezlyStoragePayload(file);
    const displayedName = description || file.filename;
    const fileExtension = file.filename.split('.').pop();
    const fileType = fileExtension?.toUpperCase();

    function handleClick() {
        track(STORY_FILE.DOWNLOAD, { id: file.uuid });
    }

    return (
        <a
            id={`attachment-${file.uuid}`}
            className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded border border-gray-200 my-10 mx-auto gap-4"
            href={downloadUrl}
            onClick={handleClick}
        >
            <div className="flex items-center gap-3">
                <FileTypeIcon className="w-6 h-6" extension={fileExtension} />
                <div>
                    <h4 className="subtitle-small">{displayedName}</h4>
                    <h5 className="text-small text-gray-600">
                        {fileType}
                        {fileType && ' - '}
                        {formatBytes(file.size)}
                    </h5>
                </div>
            </div>
            <DownloadLink />
        </a>
    );
}
