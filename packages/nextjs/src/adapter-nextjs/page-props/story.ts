import type {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    GetStaticPropsContext,
    GetStaticPropsResult,
} from 'next';

import { getNextPrezlyApi } from '../../data-fetching/index.js';
import { DUMMY_DEFAULT_LOCALE } from '../../intl/index.js';
import { getNewsroomServerSideProps } from '../getNewsroomServerSideProps.js';
import { getNewsroomStaticProps } from '../getNewsroomStaticProps.js';
import { processRequest } from '../processRequest.js';
import { processStaticRequest } from '../processStaticRequest.js';

import type { PropsFunction } from './lib/types';

export function getStoryPageServerSideProps<CustomProps extends Record<string, any>>(
    customProps: CustomProps | PropsFunction<CustomProps>,
) {
    return async function getServerSideProps(
        context: GetServerSidePropsContext,
    ): Promise<GetServerSidePropsResult<CustomProps>> {
        const api = getNextPrezlyApi(context.req);

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

        serverSideProps.newsroomContextProps.currentStory = story;

        return processRequest(context, {
            ...serverSideProps,
            ...(typeof customProps === 'function'
                ? await (customProps as PropsFunction<CustomProps>)(context, serverSideProps)
                : customProps),
        });
    };
}

export function getStoryPageStaticProps<CustomProps extends Record<string, any>>(
    customProps: CustomProps | PropsFunction<CustomProps, GetStaticPropsContext>,
) {
    return async function getStaticProps(
        context: GetStaticPropsContext,
    ): Promise<GetStaticPropsResult<CustomProps>> {
        const api = getNextPrezlyApi();

        const { slug } = context.params as { slug?: string };
        const story = slug ? await api.getStoryBySlug(slug) : null;
        if (!story) {
            return { notFound: true };
        }

        const { staticProps } = await getNewsroomStaticProps(context, { story });

        staticProps.newsroomContextProps.currentStory = story;

        return processStaticRequest(context, {
            ...staticProps,
            ...(typeof customProps === 'function'
                ? await (customProps as PropsFunction<CustomProps, GetStaticPropsContext>)(
                      context,
                      staticProps,
                  )
                : customProps),
        });
    };
}

export async function getStoryPageStaticPaths(options: { pinning?: boolean } = {}) {
    const api = getNextPrezlyApi();
    const stories = await api.getAllStories({
        pinning: options.pinning ?? false,
    });

    const paths = stories.map(({ slug }) => ({ params: { slug } }));

    return {
        paths,
        fallback: 'blocking',
    };
}
