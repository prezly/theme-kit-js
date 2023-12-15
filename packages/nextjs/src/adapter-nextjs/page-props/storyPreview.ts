import type { Story } from '@prezly/sdk';
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { NextContentDelivery } from '../../data-fetching';
import { getNewsroomServerSideProps } from '../getNewsroomServerSideProps';
import { processRequest } from '../processRequest';

import type { PropsFunction } from './lib/types';

export function getStoryPreviewPageServerSideProps<CustomProps extends Record<string, any>>(
    customProps: CustomProps | PropsFunction<CustomProps>,
    formats?: Story.FormatVersion[],
) {
    return async function getServerSideProps(
        context: GetServerSidePropsContext,
    ): Promise<GetServerSidePropsResult<CustomProps>> {
        const api = NextContentDelivery.initClient(context.req, { formats });
        const { uuid } = context.params as { uuid: string };
        const story = await api.story({ uuid });
        if (!story) {
            return { notFound: true };
        }

        const { serverSideProps } = await getNewsroomServerSideProps(context, {
            story,
        });

        serverSideProps.newsroomContextProps.currentStory = story;

        return processRequest(context, {
            ...serverSideProps,
            ...(typeof customProps === 'function'
                ? await (customProps as PropsFunction<CustomProps>)(context, serverSideProps)
                : customProps),
        });
    };
}
