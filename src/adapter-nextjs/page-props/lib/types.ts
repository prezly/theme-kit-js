import type { GetServerSidePropsContext } from 'next';

import type { PageProps } from '../../../types';

export type PropsFunction<CustomProps> = (
    context: GetServerSidePropsContext,
    props: PageProps,
) => CustomProps | Promise<CustomProps>;
