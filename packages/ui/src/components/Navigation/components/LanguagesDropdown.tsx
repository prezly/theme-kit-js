import { CheckIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import type { Culture, NewsroomLanguageSettings } from '@prezly/sdk';
import { getLanguageDisplayName, getUsedLanguages } from '@prezly/theme-kit-core';
import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

import { Dropdown } from '@/components/Dropdown';

export interface Props {
    languages: NewsroomLanguageSettings[];
    locale: Culture['code'];
}

export function LanguagesDropdown({ languages, locale }: Props) {
    const currentLanguage = languages.find((language) => language.locale.code === locale);

    const displayedLanguages = useMemo(() => {
        if (!languages.length) {
            return [];
        }

        return getUsedLanguages(languages).sort((a, b) =>
            getLanguageDisplayName(a, languages).localeCompare(
                getLanguageDisplayName(b, languages),
            ),
        );
    }, [languages]);

    return (
        <Dropdown
            className="border-0 w-max p-0"
            contentClassName="border mt-2 p-0"
            label={<GlobeAltIcon className="w-[20px] h-[20px]" />}
        >
            <Dropdown.Group>
                {displayedLanguages.map((language, index) => (
                    <Dropdown.Item
                        className={twMerge(
                            'px-6 py-4 border-b border-gray-200 flex items-center justify-between',
                            index === displayedLanguages.length - 1 && `border-b-0`,
                        )}
                        key={language.code}
                    >
                        <span>{getLanguageDisplayName(language, languages)}</span>
                        {language.code === currentLanguage?.code && (
                            <CheckIcon className="w-[20px] h-[20px]" />
                        )}
                    </Dropdown.Item>
                ))}
            </Dropdown.Group>
        </Dropdown>
    );
}
