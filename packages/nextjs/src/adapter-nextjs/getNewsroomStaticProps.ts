import type { Story } from '@prezly/sdk';
import { assertServerEnv } from '@prezly/theme-kit-core';
import type { GetStaticPropsContext } from 'next';

import { getNextPrezlyApi } from '../data-fetching';

interface Options {
    loadHomepageContacts?: boolean;
    story?: Pick<Story, 'culture'>;
}

/**
 * Use this function in your `getNewsroomStaticProps` page methods to retrieve the data necessary for the NewsroomContextProvider and `processRequest` function.
 * See README for usage examples.
 */
export async function getNewsroomStaticProps(
    context: GetStaticPropsContext,
    options: Options = {},
) {
    assertServerEnv('getNewsroomStaticProps');
    const { locale } = context;

    const api = getNextPrezlyApi();
    const staticProps = await api.getNewsroomServerSideProps(undefined, locale, options.story);

    if (options.loadHomepageContacts) {
        staticProps.newsroomContextProps.contacts = await api.getNewsroomContacts();
    }

    return { api, staticProps };
}
