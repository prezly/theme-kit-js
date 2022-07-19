import type { GetServerSidePropsContext, GetStaticPropsContext } from 'next';

import type { PageProps } from '../../../types';

export type PropsFunction<CustomProps> = (
    context: GetServerSidePropsContext | GetStaticPropsContext,
    props: PageProps,
) => CustomProps | Promise<CustomProps>;
