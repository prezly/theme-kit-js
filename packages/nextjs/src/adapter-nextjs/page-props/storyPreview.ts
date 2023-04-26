import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { getNextPrezlyApi } from '../../data-fetching/index.js';
import { getNewsroomServerSideProps } from '../getNewsroomServerSideProps.js';
import { processRequest } from '../processRequest.js';

import type { PropsFunction } from './lib/types';

export function getStoryPreviewPageServerSideProps<CustomProps extends Record<string, any>>(
    customProps: CustomProps | PropsFunction<CustomProps>,
) {
    return async function getServerSideProps(
        context: GetServerSidePropsContext,
    ): Promise<GetServerSidePropsResult<CustomProps>> {
        const api = getNextPrezlyApi(context.req);
        const { uuid } = context.params as { uuid: string };
        const story = await api.getStory(uuid);
        if (!story) {
            return { notFound: true };
        }

        const { serverSideProps } = await getNewsroomServerSideProps(context, { story });

        serverSideProps.newsroomContextProps.currentStory = story;

        return processRequest(context, {
            ...serverSideProps,
            ...(typeof customProps === 'function'
                ? await (customProps as PropsFunction<CustomProps>)(context, serverSideProps)
                : customProps),
        });
    };
}
