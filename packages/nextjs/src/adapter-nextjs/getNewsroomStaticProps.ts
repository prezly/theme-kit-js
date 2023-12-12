import type { Story } from '@prezly/sdk';
import { assertServerEnv } from '@prezly/theme-kit-core';
import type { GetStaticPropsContext } from 'next';

import { NextContentDelivery } from '../data-fetching';

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
    const { locale: nextLocale } = context;

    const api = NextContentDelivery.initClient();
    const staticProps = await api.getNewsroomServerSideProps(
        nextLocale,
        options.story,
        options.loadHomepageContacts,
    );

    return { api, staticProps };
}
