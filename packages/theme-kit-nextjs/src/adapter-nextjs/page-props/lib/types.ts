import type { GetServerSidePropsContext, GetStaticPropsContext } from 'next';

import type { PageProps } from '../../../types';

export type PropsFunction<
    CustomProps,
    Context extends GetServerSidePropsContext | GetStaticPropsContext = GetServerSidePropsContext,
> = (context: Context, props: PageProps) => CustomProps | Promise<CustomProps>;
