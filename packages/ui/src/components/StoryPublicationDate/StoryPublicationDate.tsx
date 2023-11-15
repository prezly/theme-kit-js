import type { Culture } from '@prezly/sdk';
import { format } from 'date-fns';
import * as locales from 'date-fns/locale';

export function StoryPublicationDate({
    publishedAt,
    locale: currentLocale,
    dateFormat = 'd/MM/YY',
}: StoryPublicationDate.Props) {
    if (!publishedAt) {
        return null;
    }

    const date =
        typeof publishedAt === 'string' ? new Date(publishedAt) : new Date(publishedAt * 1000);

    const locale: Locale = currentLocale ? (locales as any)[currentLocale] : undefined;

    return <>{format(date, dateFormat.replace('D', 'd').replace('YY', 'yy'), { locale })}</>;
}

export namespace StoryPublicationDate {
    export interface Props {
        publishedAt?: string | number | null;
        locale?: Culture['code'];
        dateFormat?: string;
    }
}
