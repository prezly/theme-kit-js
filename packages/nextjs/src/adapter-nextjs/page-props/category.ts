import type { Story } from '@prezly/sdk';
import { DEFAULT_PAGE_SIZE, getLocalizedCategoryData, LocaleObject } from '@prezly/theme-kit-core';
import type {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    GetStaticPathsResult,
    GetStaticPropsContext,
    GetStaticPropsResult,
} from 'next';

import { getNextPrezlyApi } from '../../data-fetching';
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

        const { slug } = context.params as { slug: string };
        const category = await api.getCategoryBySlug(slug);

        if (!category) {
            return {
                notFound: true,
            };
        }

        const { query } = context;
        const page = query.page && typeof query.page === 'string' ? Number(query.page) : undefined;

        const { localeCode } = serverSideProps.newsroomContextProps;

        const { stories, storiesTotal } = await api.getStoriesFromCategory(category, {
            page,
            pageSize,
            include: extraStoryFields,
            localeCode,
        });

        serverSideProps.newsroomContextProps.currentCategory = category;

        return processRequest(
            context,
            {
                ...serverSideProps,
                stories,
                pagination: {
                    itemsTotal: storiesTotal,
                    currentPage: page ?? 1,
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

        const { slug } = context.params as { slug: string };
        const category = await api.getCategoryBySlug(slug);

        if (!category) {
            return {
                notFound: true,
            };
        }

        const { localeCode } = staticProps.newsroomContextProps;

        const { stories, storiesTotal } = await api.getStoriesFromCategory(category, {
            pageSize,
            include: extraStoryFields,
            localeCode,
        });

        staticProps.newsroomContextProps.currentCategory = category;

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

export async function getCategoryPageStaticPaths(): Promise<GetStaticPathsResult> {
    const api = getNextPrezlyApi();
    const [categories, defaultLanguage] = await Promise.all([
        api.getCategories(),
        api.getNewsroomDefaultLanguage(),
    ]);
    const locale = LocaleObject.fromAnyCode(defaultLanguage.code);

    const paths = categories
        .map((category) => {
            const { slug } = getLocalizedCategoryData(category, locale);
            if (!slug) {
                return undefined;
            }

            return { params: { slug } };
        })
        .filter<{ params: { slug: string } }>(Boolean as any);

    return {
        paths,
        fallback: 'blocking',
    };
}
