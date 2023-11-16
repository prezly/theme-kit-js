'use client';

import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import type { NewsroomGallery } from '@prezly/sdk';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { ButtonLink } from '../Button';
import { StoryShareLinks } from '../StoryShareLinks';

export function GalleryTitle({ className, gallery }: GalleryTitle.Props) {
    const { name, description, downloadHref } = gallery;

    const [url, setUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setUrl(window.location.href);
        }
    }, []);

    return (
        <div className={twMerge('container px-6 py-12 sm:p-12', className)}>
            <div className="max-w-3xl mx-auto">
                <h1 className="title-large">{name}</h1>
                {description && <p className="subtitle-large mt-3">{description}</p>}
                <div className="mt-6 flex items-center gap-4">
                    {downloadHref && (
                        <ButtonLink
                            href={downloadHref}
                            forceRefresh
                            icon={ArrowDownTrayIcon}
                            iconPlacement="right"
                            size="small"
                        >
                            Download
                        </ButtonLink>
                    )}
                    <StoryShareLinks shareUrl={url} />
                </div>
            </div>
        </div>
    );
}

export namespace GalleryTitle {
    export interface DisplayedGallery {
        name: NewsroomGallery['name'];
        description: NewsroomGallery['description'];
        downloadHref?: string | null;
    }

    export interface Props {
        className?: string;
        gallery: DisplayedGallery;
    }
}
