import type { Story } from '@prezly/sdk';
import type { GetStaticPropsContext } from 'next';
import 'server-only';

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
    const { locale: nextLocale } = context;

    const api = NextContentDelivery.initClient();
    const staticProps = await api.getNewsroomServerSideProps(
        nextLocale,
        options.story,
        options.loadHomepageContacts,
    );

    return { api, staticProps };
}
