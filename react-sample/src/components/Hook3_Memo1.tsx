// メモ化による無駄な再描画の抑制
// 再描画が発生する条件
// 1. propsや内部状態が更新されたとき
// 2. コンポーネント内で参照しているContextの値が更新されたとき
// 3. 親コンポーネントが再描画されたとき

// Warning: 親コンポーネントが再描画されたとき, 子コンポーネントが無条件で再描画される.
// メモ化は, 無条件で発生する親コンポーネントによる再描画を抑制する.
// 再描画の条件を参照先の状態変化のみに絞る

import React, { memo, useState } from 'react';

type FizzProps = {
    isFizz: boolean;
}

// Fizzは通常の関数コンポーネント　
// isFizzがtrueの場合, Fizzと表示し, それ以外は何も表示しない
// isFizzの変化に関わらず, 親が再描画されるとFizzも再描画される(無駄)
const Fizz = (props: FizzProps): JSX.Element => {
    const { isFizz } = props;
    console.log(`Fizzが再描画されました. isFizz=${isFizz}`);
    return (
        <span>{isFizz ? 'Fizz' : ''}</span>
    )
}

type BuzzProps = {
    isBuzz: boolean;
}


// Buzzはメモ化した関数コンポーネント
// isBuzzがtrueの場合は, Buzzと表示し, それ以外は何もしない.
// 親コンポーネントが再描画されても, isBuzzが変化しない限り, Buzzは再描画しない
const Buzz = memo<BuzzProps>((props: BuzzProps): JSX.Element => {
    const { isBuzz } = props;
    console.log(`Buzzが再描画されました. isBuzz=${isBuzz}`);
    return (
        <span>
            {isBuzz ? 'Buzz' : ''}
        </span>
    )
})

// この形式でexportしたときは, import { ParentOfMemComp } from ... で読み込む.
export const ParentOfMemoComp1 = (): JSX.Element => {
    const [count, setCount] = useState(1);
    const isFizz = count % 3 === 0;
    const isBuzz = count % 5 === 0;

    console.log(`ParentOfMemが再描画されました. count=${count}`);

    return (
        <div>
            <button onClick={() => setCount((c) => c+1)}>+1</button>
            <p>{`現在のカウント: ${count}`}</p>
            <p>
                <Fizz isFizz={isFizz} />
                <Buzz isBuzz={isBuzz} />
            </p>
        </div>
    )
}