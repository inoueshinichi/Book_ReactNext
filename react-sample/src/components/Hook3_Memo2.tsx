// Hook3_Memo1.tsxのBuzzPropsにコールバック関数を追加
// memo化しても, コンポーネント入力(props)が変化するとコンポーネントの再描画が発生する.
import React, { memo, useState } from 'react';

type FizzProps = {
    isFizz: boolean;
}

const Fizz = (props: FizzProps): JSX.Element => {
    const { isFizz } = props;
    console.log(`Fizzが再描画されました. isFizz=${isFizz}`);
    return (
        <span>{isFizz ? 'Fizz' : ''}</span>
    )
}

type BuzzProps = {
    isBuzz: boolean;
    onClick: () => void; // propsにonClickを追加
};

const Buzz = memo<BuzzProps>((props: BuzzProps): JSX.Element => {
    const { isBuzz, onClick } = props;
    console.log(`Buzzが再描画されました. isBuzz=${isBuzz}`);
    return (
        <span onClick={onClick}>
            {isBuzz ? 'Buzz' : ''}
        </span>
    )
})


export const ParentOfMemoComp2 = (): JSX.Element => {
    const [count, setCount] = useState(1);
    const isFizz = count % 3 === 0;
    const isBuzz = count % 5 === 0;

    // この関数はParentOfMemoComp2の再描画のたびに作成される.
    const onBuzzClick = (): void => {
        console.log(`Buzzがクリックされました. isBuzz=${isBuzz}`);
    }
    console.log(`ParentOfMemoComp2が再描画されました. count=${count}`);

    return (
        <div>
            <button onClick={() => setCount((c) => c + 1)}>+1</button>
            <p>{`現在のカウント: ${count}`}</p>
            <p>
                <Fizz isFizz={isFizz}/>
                <Buzz isBuzz={isBuzz} onClick={onBuzzClick}/>
            </p>
        </div>
    )
}