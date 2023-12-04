import type { Story } from '@prezly/sdk';
import { DEFAULT_PAGE_SIZE } from '@prezly/theme-kit-core';
import type {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    GetStaticPropsContext,
    GetStaticPropsResult,
} from 'next';

import type { PaginationProps } from '../../infinite-loading/types';
import { getNewsroomServerSideProps } from '../getNewsroomServerSideProps';
import { getNewsroomStaticProps } from '../getNewsroomStaticProps';
import { processRequest } from '../processRequest';
import { processStaticRequest } from '../processStaticRequest';

import type { PropsFunction } from './lib/types';

export interface HomePageProps<Include extends keyof Story.ExtraFields = never> {
    stories: (Story & Pick<Story.ExtraFields, Include>)[];
    pagination: PaginationProps;
}

interface Options<Include extends keyof Story.ExtraFields> {
    extraStoryFields?: Include[];
    /**
     * When set to `true`, the initial `stories` array will include one extra story to place as highlighted story.
     * This will offset each subsequent page by 1 story to account for that.
     */
    withHighlightedStory?: boolean;
    pageSize?: number;
    pinning?: boolean;
    filterQuery?: Object;
}

export function getHomepageServerSideProps<
    CustomProps extends Record<string, any>,
    Include extends keyof Story.ExtraFields = never,
>(customProps: CustomProps | PropsFunction<CustomProps>, options?: Options<Include>) {
    const {
        pageSize = DEFAULT_PAGE_SIZE,
        extraStoryFields,
        pinning = false,
        withHighlightedStory = false,
        filterQuery,
    } = options || {};

    return async function getServerSideProps(
        context: GetServerSidePropsContext,
    ): Promise<GetServerSidePropsResult<HomePageProps<Include> & CustomProps>> {
        const { api, serverSideProps } = await getNewsroomServerSideProps(context, {
            loadHomepageContacts: true,
        });

        const { query } = context;
        const page = query.page && typeof query.page === 'string' ? Number(query.page) : undefined;

        const { localeCode } = serverSideProps.newsroomContextProps;

        const storiesPaginated = await api.getStories({
            page,
            pageSize,
            pinning,
            include: extraStoryFields,
            localeCode,
            withHighlightedStory,
            filterQuery,
        });
        const { stories, storiesTotal } = storiesPaginated;

        return processRequest(
            context,
            {
                ...serverSideProps,
                stories,
                pagination: {
                    itemsTotal: storiesTotal,
                    currentPage: page ?? 1,
                    pageSize,
                    withHighlightedStory,
                },
                ...(typeof customProps === 'function'
                    ? await (customProps as PropsFunction<CustomProps>)(context, serverSideProps)
                    : customProps),
            },
            '/',
        );
    };
}

export function getHomepageStaticProps<
    CustomProps extends Record<string, any>,
    Include extends keyof Story.ExtraFields = never,
>(
    customProps: CustomProps | PropsFunction<CustomProps, GetStaticPropsContext>,
    options: Options<Include> = {},
) {
    const { pageSize = DEFAULT_PAGE_SIZE, extraStoryFields = [], pinning = false } = options;

    return async function getStaticProps(
        context: GetStaticPropsContext,
    ): Promise<GetStaticPropsResult<HomePageProps<Include> & CustomProps>> {
        const { api, staticProps } = await getNewsroomStaticProps(context, {
            loadHomepageContacts: true,
        });

        const { localeCode } = staticProps.newsroomContextProps;

        const storiesPaginated = await api.getStories({
            pageSize,
            pinning,
            include: extraStoryFields,
            localeCode,
        });
        const { stories, storiesTotal } = storiesPaginated;

        return processStaticRequest(context, {
            ...staticProps,
            stories,
            pagination: {
                itemsTotal: storiesTotal,
                currentPage: 1,
                pageSize,
            },
            ...(typeof customProps === 'function'
                ? await (customProps as PropsFunction<CustomProps, GetStaticPropsContext>)(
                      context,
                      staticProps,
                  )
                : customProps),
        });
    };
}