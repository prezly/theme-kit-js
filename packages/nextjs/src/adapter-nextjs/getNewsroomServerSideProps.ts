import type { Story } from '@prezly/sdk';
import { assertServerEnv } from '@prezly/theme-kit-core';
import type { GetServerSidePropsContext } from 'next';

import { getNextPrezlyApi } from '../data-fetching';

interface Options {
    loadHomepageContacts?: boolean;
    story?: Pick<Story, 'culture'>;
}

/**
 * Use this function in your `getServerSideProps` page methods to retrieve the data necessary for the NewsroomContextProvider and `processRequest` function.
 * See README for usage examples.
 */
export async function getNewsroomServerSideProps(
    context: GetServerSidePropsContext,
    options: Options = {},
) {
    assertServerEnv('getNewsroomServerSideProps');
    const { req: request, locale } = context;

    const api = getNextPrezlyApi(request);
    const serverSideProps = await api.getNewsroomServerSideProps(request, locale, options.story);

    if (options.loadHomepageContacts) {
        serverSideProps.newsroomContextProps.contacts = await api.getNewsroomContacts();
    }

    return { api, serverSideProps };
}
