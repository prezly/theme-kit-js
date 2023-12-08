import type { Story } from '@prezly/sdk';
import { assertServerEnv } from '@prezly/theme-kit-core';
import type { GetStaticPropsContext } from 'next';

import { NextContentDelivery } from '../data-fetching';

interface Options {
    loadHomepageContacts?: boolean;
    story?: Pick<Story, 'culture'>;
    pinning?: boolean;
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

    const api = NextContentDelivery.initClient(undefined, {
        pinning: options.pinning,
    });
    const staticProps = await api.getNewsroomServerSideProps(
        locale,
        options.story,
        options.loadHomepageContacts,
    );

    return { api, staticProps };
}
