import type {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    GetStaticPropsContext,
} from 'next';

import { getNewsroomServerSideProps } from '../getNewsroomServerSideProps.js';
import { getNewsroomStaticProps } from '../getNewsroomStaticProps.js';
import { processRequest } from '../processRequest.js';
import { processStaticRequest } from '../processStaticRequest.js';

import type { PropsFunction } from './lib/types';

export function getSearchPageServerSideProps<CustomProps extends Record<string, any>>(
    customProps: CustomProps | PropsFunction<CustomProps>,
) {
    return async function getServerSideProps(
        context: GetServerSidePropsContext,
    ): Promise<GetServerSidePropsResult<CustomProps>> {
        const { serverSideProps } = await getNewsroomServerSideProps(context);

        return processRequest(
            context,
            {
                ...serverSideProps,
                ...(typeof customProps === 'function'
                    ? await (customProps as PropsFunction<CustomProps>)(context, serverSideProps)
                    : customProps),
            },
            '/search',
        );
    };
}

export function getSearchPageStaticProps<CustomProps extends Record<string, any>>(
    customProps: CustomProps | PropsFunction<CustomProps, GetStaticPropsContext>,
) {
    return async function getStaticProps(
        context: GetServerSidePropsContext,
    ): Promise<GetServerSidePropsResult<CustomProps>> {
        const { staticProps } = await getNewsroomStaticProps(context);

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
