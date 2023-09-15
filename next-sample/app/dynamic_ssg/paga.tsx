/* dynamic path SSG (Static Site Generation) */

// React
import React from 'react';

// Next.jsの組み込みのコンポーネント
import Head from 'next/head';

import { ParsedUrlQuery } from 'querystring';
import { useRouter } from 'next:router';

import { getData, PathParams, RetData } from './_private/gen_dynamic_path';

interface PostParams extends ParsedUrlQuery {
    id: string;
};

// React コンポーネント
export default async function DynamicSSG(): Promise<JSX.Element> {
    const { paths, fallback } = await getData();
    const router = useRouter();

    if (router.isFallback) {
        // フォールバック向けのページを示す
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <p>このページは静的サイト生成によってビルド時に生成されたページです.</p>
                <p>{`/posts/${id}に対応するベージです`}</p>
            </main>
        </div>
    )
}