import { Icons } from '@/icons';

export function MadeWithPrezly() {
    return (
        <a
            href="https://prez.ly/storytelling-platform"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-white rounded flex items-center gap-1 text-center justify-center"
        >
            <Icons.Prezly className="w-4 h-4" />
            <span className="label-medium text-sm">Made with Prezly</span>
        </a>
    );
}
