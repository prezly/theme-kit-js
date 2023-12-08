import type { Story } from '@prezly/sdk';
import { assertServerEnv } from '@prezly/theme-kit-core';
import type { GetServerSidePropsContext } from 'next';

import { NextContentDelivery } from '../data-fetching';

interface Options {
    loadHomepageContacts?: boolean;
    story?: Pick<Story, 'culture'>;
    pinning?: boolean;
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

    const api = NextContentDelivery.initClient(request, {
        pinning: options.pinning,
    });

    const serverSideProps = await api.getNewsroomServerSideProps(
        locale,
        options.story,
        options.loadHomepageContacts,
    );

    return { api, serverSideProps };
}
