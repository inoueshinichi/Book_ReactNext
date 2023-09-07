// 無名関数でコンポーネントを定義し, Textという変数に代入する
// Textコンポーネントは親から`content`というデータを受け取る(props?)
const Text = (props: { content: string }): JSX.Element => {
    // propsからcontentという値を取り出す
    const { content } = props; // 分割代入の構文
    // propsで渡されたデータを表示する
    return <p className="text">{content}</p>
}


// 同様に定義したコンポーネントをMessageという変数に入れる
const Message = (props: {}): JSX.Element => {
    const content1 = 'This is parent component';
    const content2 = 'Message uses Text component';

    return (
        <div>
            {/* contentというキーでコンポーネントにデータを渡す */}
            <Text content={content1} />
            {/* 違うデータを渡すと, 違う内容が表示される */}
            <Text content={content2} />
        </div>
    )
}

export default Message;
