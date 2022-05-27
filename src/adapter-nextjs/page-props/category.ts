import type { ExtraStoryFields, Story } from '@prezly/sdk';
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import type { PaginationProps } from '../../infinite-loading/types';
import { DEFAULT_PAGE_SIZE } from '../../utils';
import { getNewsroomServerSideProps } from '../getNewsroomServerSideProps';
import { processRequest } from '../processRequest';

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
            include: extraStoryFields,
            localeCode,
        });

        return processRequest(
            context,
            {
                ...serverSideProps,
                newsroomContextProps: {
                    ...serverSideProps.newsroomContextProps,
                    currentCategory: category,
                },
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
