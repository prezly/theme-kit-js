import type { Story } from '@prezly/sdk';
import type { GetServerSidePropsContext } from 'next';

import { getPrezlyApi } from '../data-fetching';

interface Options {
    loadHomepageContacts?: boolean;
    story?: Story;
}

export async function getNewsroomServerSideProps(
    context: GetServerSidePropsContext,
    options: Options = {},
) {
    const { req: request, locale } = context;

    const api = getPrezlyApi(request);
    const serverSideProps = await api.getNewsroomServerSideProps(request, locale, options.story);

    if (options.loadHomepageContacts) {
        serverSideProps.newsroomContextProps.contacts = await api.getNewsroomContacts();
    }

    return { api, serverSideProps };
}
