// SSG用ユーティリティ

// ページコンポーネントのpropsを定義(ここでは空)
export type SSGProps = {
    tmspMsg?: string;
    holdText: string;
};

// SSG generateStaticParams()
export async function generateStaticParams(): Promise<SSGProps> {
    const timestamp: string = new Date().toLocaleDateString();
    const tmspMsg: string = `${timestamp}にSSG.getInitialPropsが実行されました`;
    console.log(tmspMsg);
    console.log("腹立つこども");
    const holdText: string = "HoldText";

    // ここで返したpropsをもとにページコンポーネントを描画する
    return {
        tmspMsg,
        holdText,
    };
}