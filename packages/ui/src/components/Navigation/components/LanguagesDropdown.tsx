'use client';

import { CheckIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import type { Category, Culture, ExtendedStory, NewsroomLanguageSettings } from '@prezly/sdk';
import { getLanguageDisplayName, getUsedLanguages, LocaleObject } from '@prezly/theme-kit-core';
import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

import { Dropdown } from '@/components/Dropdown';

import { getTranslationUrl } from '../util';

export interface Props {
    languages: NewsroomLanguageSettings[];
    locale: Culture['code'];
    currentStory?: ExtendedStory;
    currentCategory?: Pick<Category, 'i18n' | 'display_name'>;
    hasError?: boolean;
}

export function LanguagesDropdown({
    languages,
    locale,
    hasError,
    currentCategory,
    currentStory,
}: Props) {
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
            className="border-0 w-max p-0 bg-transparent text-gray-600 hover:text-gray-800"
            contentClassName="border mt-2 p-0"
            label={<GlobeAltIcon className="w-[20px] h-[20px]" />}
        >
            <Dropdown.Group>
                {displayedLanguages.map((language, index) => {
                    const translationLink = hasError
                        ? '/'
                        : getTranslationUrl(
                              LocaleObject.fromAnyCode(language.code),
                              currentCategory,
                              currentStory,
                          );

                    const link =
                        currentStory && translationLink !== '/'
                            ? translationLink
                            : `/${language.code}${translationLink}`;

                    return (
                        <Dropdown.Item
                            className={twMerge(
                                'border-b border-gray-200',
                                index === displayedLanguages.length - 1 && `border-b-0`,
                            )}
                            key={language.code}
                        >
                            <a className="px-6 py-4 flex items-center justify-between" href={link}>
                                <span>{getLanguageDisplayName(language, languages)}</span>
                                {language.code === currentLanguage?.code && (
                                    <CheckIcon className="w-[20px] h-[20px]" />
                                )}
                            </a>
                        </Dropdown.Item>
                    );
                })}
            </Dropdown.Group>
        </Dropdown>
    );
}
