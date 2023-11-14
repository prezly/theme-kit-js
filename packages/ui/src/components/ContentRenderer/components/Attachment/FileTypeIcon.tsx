import { DocumentIcon, FilmIcon, MusicalNoteIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface Props {
    className?: string;
    extension?: string;
}

function getIconComponentFromExtension(extension?: string) {
    switch (extension) {
        case 'ae':
        case 'ai':
        case 'xls':
        case 'xlsx':
        case 'id':
        case 'pdf':
        case 'ppt':
        case 'pptx':
        case 'psd':
            return DocumentIcon;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'svg':
        case 'webp':
            return PhotoIcon;
        case 'mp3':
        case 'wav':
        case 'ogg':
            return MusicalNoteIcon;
        case 'mp4':
        case 'avi':
        case 'mov':
        case 'mpeg':
        case 'webm':
        case 'flv':
        case 'ogv':
            return FilmIcon;
        default:
            return DocumentIcon;
    }
}

export function FileTypeIcon({ extension, className }: Props) {
    const IconComponent = getIconComponentFromExtension(extension);
    return <IconComponent className={className} />;
}
