import type { Culture, Story } from '@prezly/sdk';
import { getStoryPublicationDate } from '@prezly/theme-kit-core';
import { format } from 'date-fns';
import * as locales from 'date-fns/locale';

interface Props {
    story: Story;
    locale?: Culture['code'];
}

export function StoryPublicationDate({ story, locale: currentLocale }: Props) {
    const date = getStoryPublicationDate(story);
    const dateFormat = story.newsroom.date_format;

    if (!date) {
        return null;
    }

    const locale: Locale = currentLocale ? (locales as any)[currentLocale] : undefined;

    return <>{format(date, dateFormat.toLowerCase(), { locale })}</>;
}
