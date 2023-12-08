import type { Story } from '@prezly/sdk';
import { Category } from '@prezly/sdk';
import { DEFAULT_PAGE_SIZE } from '@prezly/theme-kit-core';
import { isNotUndefined } from '@technically/is-not-undefined';
import type {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    GetStaticPathsResult,
    GetStaticPropsContext,
    GetStaticPropsResult,
} from 'next';

import { NextContentDelivery } from '../../data-fetching';
import type { PaginationProps } from '../../infinite-loading/types';
import { getNewsroomServerSideProps } from '../getNewsroomServerSideProps';
import { getNewsroomStaticProps } from '../getNewsroomStaticProps';
import { processRequest } from '../processRequest';
import { processStaticRequest } from '../processStaticRequest';

import type { PropsFunction } from './lib/types';

export interface CategoryPageProps<Include extends keyof Story.ExtraFields = never> {
    stories: (Story & Pick<Story.ExtraFields, Include>)[];
    pagination: PaginationProps;
}

interface Options<Include extends keyof Story.ExtraFields> {
    extraStoryFields?: Include[];
    pageSize?: number;
}

export function getCategoryPageServerSideProps<
    CustomProps extends Record<string, any>,
    Include extends keyof Story.ExtraFields = never,
>(customProps: CustomProps | PropsFunction<CustomProps>, options: Options<Include> = {}) {
    const { pageSize = DEFAULT_PAGE_SIZE, extraStoryFields } = options;

    return async function getServerSideProps(
        context: GetServerSidePropsContext,
    ): Promise<GetServerSidePropsResult<CategoryPageProps<Include> & CustomProps>> {
        const { api, serverSideProps } = await getNewsroomServerSideProps(context);
        const { locale } = serverSideProps.newsroomContextProps;
        const { slug } = context.params as { slug: string };

        const category = await api.translatedCategory(locale, slug);

        if (!category) {
            return {
                notFound: true,
            };
        }

        const { query } = context;
        const page = query.page && typeof query.page === 'string' ? Number(query.page) : 1;

        const { stories, pagination } = await api.stories(
            {
                category,
                offset: (page - 1) * pageSize,
                limit: pageSize,
                locale,
            },
            {
                include: extraStoryFields,
            },
        );

        serverSideProps.newsroomContextProps.currentCategory = category;

        return processRequest(
            context,
            {
                ...serverSideProps,
                stories,
                pagination: {
                    itemsTotal: pagination.matched_records_number,
                    currentPage: page,
                    pageSize,
                },
                ...(typeof customProps === 'function'
                    ? await (customProps as PropsFunction<CustomProps>)(context, serverSideProps)
                    : customProps),
            },
            `/category/${slug}`,
        );
    };
}

export function getCategoryPageStaticProps<
    CustomProps extends Record<string, any>,
    Include extends keyof Story.ExtraFields = never,
>(
    customProps: CustomProps | PropsFunction<CustomProps, GetStaticPropsContext>,
    options: Options<Include> = {},
) {
    const { pageSize = DEFAULT_PAGE_SIZE, extraStoryFields = [] } = options;

    return async function getStaticProps(
        context: GetStaticPropsContext,
    ): Promise<GetStaticPropsResult<CategoryPageProps<Include> & CustomProps>> {
        const { api, staticProps } = await getNewsroomStaticProps(context);
        const { locale } = staticProps.newsroomContextProps;
        const { slug } = context.params as { slug: string };

        const category = await api.translatedCategory(locale, slug);

        if (!category) {
            return {
                notFound: true,
            };
        }

        const { stories, pagination } = await api.stories(
            {
                category,
                limit: pageSize,
                locale,
            },
            {
                include: extraStoryFields,
            },
        );

        staticProps.newsroomContextProps.currentCategory = category;

        return processStaticRequest(context, {
            ...staticProps,
            stories,
            pagination: {
                itemsTotal: pagination.matched_records_number,
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

export async function getCategoryPageStaticPaths(): Promise<GetStaticPathsResult> {
    const api = NextContentDelivery.initClient();
    const [categories, defaultLocale] = await Promise.all([api.categories(), api.defaultLocale()]);

    const paths = categories
        .map((category) => {
            const translation = Category.translation(category, defaultLocale);
            if (!translation) {
                return undefined;
            }

            return {
                params: { slug: translation.slug },
            };
        })
        .filter(isNotUndefined);

    return {
        paths,
        fallback: 'blocking',
    };
}
