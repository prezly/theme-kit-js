import type { Story } from '@prezly/sdk';
import type {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    GetStaticPropsContext,
    GetStaticPropsResult,
} from 'next';

import { NextContentDelivery } from '../../data-fetching';
import { DUMMY_DEFAULT_LOCALE } from '../../intl';
import { getNewsroomServerSideProps } from '../getNewsroomServerSideProps';
import { getNewsroomStaticProps } from '../getNewsroomStaticProps';
import { processRequest } from '../processRequest';
import { processStaticRequest } from '../processStaticRequest';

import type { PropsFunction } from './lib/types';

export function getStoryPageServerSideProps<CustomProps extends Record<string, any>>(
    customProps: CustomProps | PropsFunction<CustomProps>,
    formats?: Story.FormatVersion[],
) {
    return async function getServerSideProps(
        context: GetServerSidePropsContext,
    ): Promise<GetServerSidePropsResult<CustomProps>> {
        const api = NextContentDelivery.initClient(context.req, { formats });

        const { slug } = context.params as { slug?: string };
        const story = slug ? await api.story({ slug }) : null;
        if (!story) {
            return { notFound: true };
        }

        const { serverSideProps } = await getNewsroomServerSideProps(context, {
            story,
        });

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
    formats?: Story.FormatVersion[],
) {
    return async function getStaticProps(
        context: GetStaticPropsContext,
    ): Promise<GetStaticPropsResult<CustomProps>> {
        const api = NextContentDelivery.initClient(undefined, { formats });

        const { slug } = context.params as { slug?: string };
        const story = slug ? await api.story({ slug }) : null;
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

export async function getStoryPageStaticPaths(
    options: {
        /**
         * @deprecated Story Pinning will always be enabled in the next major release.
         */
        pinning?: boolean;
    } = {},
) {
    const api = NextContentDelivery.initClient(undefined, {
        pinning: options.pinning,
    });
    const stories = await api.allStories();

    const paths = stories.map(({ slug }) => ({ params: { slug } }));

    return {
        paths,
        fallback: 'blocking',
    };
}
