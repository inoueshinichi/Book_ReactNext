/* SSG (Static Site Generation) */

// React
import React from 'react';

// Next.jsの組み込みのコンポーネント
import Head from 'next/head';

// 型のために導入
import { NextPage } from 'next';
import { GetStaticProps } from 'next';
import { NextPageContext } from 'next';

// fetching func for constructing before building SSG
import { generateStaticParams } from '@/app/ssg/_private/ssg_utils';

// React コンポーネント
export default async function SSG(): Promise<JSX.Element> {
    const { tmspMsg, holdText } = await generateStaticParams();

    const message = tmspMsg ?? "padding due to null";

    return (
        <div>
            {/* Headコンポーネントで包むとその要素は<head>タグに配置される */}
            <Head>
                <title>Static Site Generation</title>
                <link rel="icon" href="./favicon.ico" />
            </Head>
            <main>
                <p>
                    このページは静的サイト生成によってビルド時に生成されたページです.
                    getStaticPropsを使っていないので, 厳密にはStatic.
                </p>
                <p>{message}</p>
                <p>{holdText}</p>
            </main>
        </div>
    );
}



