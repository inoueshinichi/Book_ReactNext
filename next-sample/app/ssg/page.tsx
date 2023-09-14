/* SSG (Static Site Generation) */

// 型のために導入
import { NextPage } from 'next';

// Next.jsの組み込みのコンポーネント
import Head from 'next/head';

// ページコンポーネントのpropsを定義(ここでは空)
type SSGProps = {};

// SSG向けページを実装
// NextPageはNext.jsのPages向けの型
// NextPage<props>でpropsが入るPageであることを明示
const SSG: NextPage<SSGProps> = () => {
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
            </main>
        </div>
    );
}

export default SSG;