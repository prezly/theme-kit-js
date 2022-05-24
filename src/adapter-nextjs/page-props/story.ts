import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { getPrezlyApi } from '../../data-fetching';
import { DUMMY_DEFAULT_LOCALE } from '../../intl';
import { getNewsroomServerSideProps } from '../getNewsroomServerSideProps';
import { processRequest } from '../processRequest';

import type { PropsFunction } from './lib/types';

export function getStoryPageServerSideProps<CustomProps extends Record<string, any>>(
    customProps: CustomProps | PropsFunction<CustomProps>,
) {
    return async function getServerSideProps(
        context: GetServerSidePropsContext,
    ): Promise<GetServerSidePropsResult<CustomProps>> {
        const api = getPrezlyApi(context.req);

        const { slug } = context.params as { slug?: string };
        const story = slug ? await api.getStoryBySlug(slug) : null;
        if (!story) {
            return { notFound: true };
        }

        const { serverSideProps } = await getNewsroomServerSideProps(context, { story });

        const { locale } = context;
        if (locale && locale !== DUMMY_DEFAULT_LOCALE) {
            return {
                redirect: {
                    destination: `/${slug}`,
                    permanent: true,
                },
            };
        }

        return processRequest(context, {
            ...serverSideProps,
            newsroomContextProps: {
                ...serverSideProps.newsroomContextProps,
                currentStory: story,
            },
            ...(typeof customProps === 'function'
                ? await (customProps as PropsFunction<CustomProps>)(context, serverSideProps)
                : customProps),
        });
    };
}
