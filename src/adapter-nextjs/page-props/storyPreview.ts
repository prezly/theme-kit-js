import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { getPrezlyApi } from '../../data-fetching';
import { getNewsroomServerSideProps } from '../getNewsroomServerSideProps';
import { processRequest } from '../processRequest';

import type { PropsFunction } from './lib/types';

export function getStoryPreviewPageServerSideProps<CustomProps extends Record<string, any>>(
    customProps: CustomProps | PropsFunction<CustomProps>,
) {
    return async function getServerSideProps(
        context: GetServerSidePropsContext,
    ): Promise<GetServerSidePropsResult<CustomProps>> {
        const api = getPrezlyApi(context.req);
        const { uuid } = context.params as { uuid: string };
        const story = await api.getStory(uuid);
        if (!story) {
            return { notFound: true };
        }

        const { serverSideProps } = await getNewsroomServerSideProps(context, { story });

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
