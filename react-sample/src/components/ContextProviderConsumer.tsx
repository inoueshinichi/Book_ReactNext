import React from 'react';

// Containerのpropsの型定義
type ContainerProps = {
    title: string;
    children: React.ReactNode;
};

// Containerは赤背景のボックスの中にタイトルと子要素を表示する
const Container = (props: ContainerProps): JSX.Element => {
    const { title, children } = props;

    return (
        <div style={{ background: 'red' }}>
            <span>{title}</span>
            {/* propsのchildrenを埋め込むと, このコンポーネントの開始タグと閉じタグで囲んだ要素を表示する */}
            <div>{children}</div>
        </div>
    );
}

const Parent = (): JSX.Element => {
    return (
        // Containerを使用する際に, 他の要素を囲って使用する
        <Container title="Hello">
            <p>ここの部分が背景色で囲まれます</p>
        </Container>
    )
}

// export default Parent;


// Context: Provider-Consumerモデル

// Titleを渡すためのContextを作成する
const TitleContext = React.createContext('');

// Titleコンポーネントの中でContextの値を参照する
const Title = (): JSX.Element => {
    // Consumerを使って, Contextの値を参照する
    return (
        <TitleContext.Consumer>
            {/* Consumerの直下に関数を置いて, Contextの値を参照する */}
            {(title) => {
                return <h1>{title}</h1>
            }}
        </TitleContext.Consumer>
    );
}

const Header = (): JSX.Element => {
    return (
        <div>
            {/* HeaderからTitleへは何もデータを渡さない */}
            <Title />
        </div>
    );
}

// Pageコンポーネントの中でContextに値を渡す
const Page = (): JSX.Element => {
    const title = 'React Book';

    // Providerを使ってContextに値をセットする
    return (
        <TitleContext.Provider value={title}>
            <Header />
        </TitleContext.Provider>
    );
}

export default Page;



