// useCallbackを使ってコンポーネント内で生成されるオブジェクトや関数をメモ化して
// コンポーネントの再描画を抑制する

import React, { useState, useCallback } from 'react';

type ButtonProps = {
    onClick: () => void;
}

// DecrementButtonは通常の関数コンポーネントでボタンを表示する
const DecrementButton = (props: ButtonProps): JSX.Element => {
    const { onClick } = props;

    console.log(`DecrementButtonが再描画されました.`);

    return (
        <button onClick={onClick}>Decrement</button>
    )
}

// IncrementButtonはメモ化した関数コンポーネントでボタンを表示する
const IncrementButton = React.memo((props: ButtonProps): JSX.Element => {
    const { onClick } = props;

    console.log(`IncrementButtonが再描画されました.`);

    return (
        <button onClick={onClick}>Increment</button>
    )
})

// DoubleButtonはメモ化した関数コンポーネントでボタンを表示する
const DoubleButton = React.memo((props: ButtonProps): JSX.Element => {
    const { onClick } = props;

    console.log(`DoubleButtonが再描画されました.`);

    return (
        <button onClick={onClick}>Double</button>
    )
})

export const ParentOfMemoComp3 = (): JSX.Element => {
    const [count, setCount] = useState(0);

    // 毎回生成される
    const decrement = (): void => {
        setCount((c) => c - 1);
    }

    // 毎回生成される
    const increment = (): void => {
        setCount((c) => c + 1);
    }

    // useCallbackを使って関数をメモ化する
    const double = useCallback(() => {
        setCount((c) => c * 2);
        // 第二引数は依存配列, 関数の再描画のとき, 依存配列の中身を比較して, 異なる点があれば, 新規でコールバック関数を作る
        // つまり, メモ化が無効になる.
    }, []);

    return (
        <div>
            <p>Count: {count}</p>
            {/* コンポーネントに関数を渡す */}
            <DecrementButton onClick={decrement} />
            {/* メモ化コンポーネントに関数を渡す */}
            <IncrementButton onClick={increment} />
            {/* メモ化コンポーネントにメモ化した関数を渡す */}
            <DoubleButton onClick={double} />
        </div>
    )
}