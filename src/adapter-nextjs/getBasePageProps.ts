import type { GetServerSidePropsContext } from 'next';

import { getPrezlyApi } from '../data-fetching';

interface BasePagePropsOptions {
    loadHomepageContacts?: boolean;
}

export async function getBasePageProps(
    context: GetServerSidePropsContext,
    options: BasePagePropsOptions = {},
) {
    const { req: request, locale } = context;

    const api = getPrezlyApi(request);
    const basePageProps = await api.getBasePageProps(request, locale);

    if (options.loadHomepageContacts) {
        basePageProps.contacts = await api.getNewsroomContacts();
    }

    return { api, basePageProps };
}
