import type { Story } from '@prezly/sdk';
import type { GetServerSidePropsContext } from 'next';
import 'server-only';

import { NextContentDelivery } from '../data-fetching';

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
    const { req: request, locale: nextLocale } = context;

    const api = NextContentDelivery.initClient(request);

    const serverSideProps = await api.getNewsroomServerSideProps(
        nextLocale,
        options.story,
        options.loadHomepageContacts,
    );

    return { api, serverSideProps };
}
