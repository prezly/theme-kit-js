import { assertServerEnv } from '@prezly/theme-kit-core';
import type { GetStaticPropsContext, GetStaticPropsResult } from 'next';

import type { PageProps, ServerSidePageProps } from '../types';

/**
 * This function combines the props returned from `getNewsroomStaticProps` and your optional custom props for the page.
 * See README for usage examples.
 *
 * @param context Next.js context passed to the `getStaticProps` method of the page
 * @param props Object containing the return of `getNewsroomServerSideProps` and your optional custom props.
 * @param revalidateTimeout Optional: timeout in seconds to use with Next ISR.
 */
export function processStaticRequest<Props>(
    context: GetStaticPropsContext,
    props: Props & PageProps & ServerSidePageProps,
    revalidateTimeout?: number,
): GetStaticPropsResult<Props> {
    assertServerEnv('processStaticRequest');
    const { locale: nextLocale } = context;

    const { localeResolved, ...pageProps } = props;

    // If no locale was provided by Next, it most likely means that the theme is not supporting multi-language.
    // In that case we won't show 404 page.
    if (!localeResolved && nextLocale) {
        return { notFound: true };
    }

    return {
        props: pageProps as Props & PageProps,
        revalidate: revalidateTimeout,
    };
}
