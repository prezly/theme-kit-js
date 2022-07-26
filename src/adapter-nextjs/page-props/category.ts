import type { ExtraStoryFields, Story } from '@prezly/sdk';
import type {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    GetStaticPathsResult,
    GetStaticPropsContext,
    GetStaticPropsResult,
} from 'next';

import { getPrezlyApi } from '../../data-fetching';
import type { PaginationProps } from '../../infinite-loading/types';
import { LocaleObject } from '../../intl';
import { DEFAULT_PAGE_SIZE, getLocalizedCategoryData } from '../../utils';
import { getNewsroomServerSideProps } from '../getNewsroomServerSideProps';
import { getNewsroomStaticProps } from '../getNewsroomStaticProps';
import { processRequest } from '../processRequest';
import { processStaticRequest } from '../processStaticRequest';

import type { PropsFunction } from './lib/types';

export interface CategoryPageProps<StoryType extends Story = Story> {
    stories: StoryType[];
    pagination: PaginationProps;
}

interface Options {
    extraStoryFields?: (keyof ExtraStoryFields)[];
    pageSize?: number;
}

export function getCategoryPageServerSideProps<
    CustomProps extends Record<string, any>,
    StoryType extends Story = Story,
>(customProps: CustomProps | PropsFunction<CustomProps>, options?: Options) {
    const { pageSize = DEFAULT_PAGE_SIZE, extraStoryFields } = options || {};

    return async function getServerSideProps(
        context: GetServerSidePropsContext,
    ): Promise<GetServerSidePropsResult<CategoryPageProps<StoryType> & CustomProps>> {
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
                // TODO: This is temporary until return types from API are figured out
                stories: stories as StoryType[],
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
    StoryType extends Story = Story,
>(customProps: CustomProps | PropsFunction<CustomProps, GetStaticPropsContext>, options?: Options) {
    const { pageSize = DEFAULT_PAGE_SIZE, extraStoryFields } = options || {};

    return async function getStaticProps(
        context: GetStaticPropsContext,
    ): Promise<GetStaticPropsResult<CategoryPageProps<StoryType> & CustomProps>> {
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
            // TODO: This is temporary until return types from API are figured out
            stories: stories as StoryType[],
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
    const api = getPrezlyApi();
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
