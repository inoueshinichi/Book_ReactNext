// useMemoを用いて値をメモ化する

import React, { useState, useMemo } from 'react';


export const UseMemoSample = (): JSX.Element => {
    // textは, 現在のテキストボックスの中身の値を保持する
    const [text, setText] = useState('');

    // itemsは, 文字列のリストを保持する
    const [items, setItems] = useState<string[]>([]);

    // テキストボックスの値が変化したときに呼ばれるコールバック関数
    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setText(e.target.value);
    }

    // ボタンをクリックした時に呼ばれる関数
    const onClickButton = () => {
        // string[]配列用の更新関数
        setItems((prevItems: string[]) => {
            // 現在の入力値をitemsに追加する. 
            return [...prevItems/* spread構文(コピー) */, text]; // string[]配列
        });

        // テキストボックスの中の値を空にする
        setText('');
    }

    // numberOfCharacters1は, 再描画の度にitems.reduceを実行して結果を得る
    const numberOfCharacters1 = items.reduce((sub, item) => sub + item.length, 0);

    // numberOfCharacters2は, useMemoを使い, itemsが更新されるタイミングでitems.reduceを実行して結果を得る
    const numberOfCharacters2 = useMemo(() => {
        console.log(`numberOfCharacters2が新規で作成されました.`);
        // 第二引数の配列の中にitemsがあるので, itemsが新しくなった時だけ関数を実行してメモを更新する.
        return items.reduce((sub, item) => sub + item.length, 0);
    }, [items]); // items: string[]配列の中身が変化すれば, 新規で値が生成される.

    return (
        <div>
            <p>UseMemoSample</p>
            <div>
                <input value={text} onChange={onChangeInput} />
                <button onClick={onClickButton}>Add</button>
            </div>
            <div>
                {items.map((item, index) => (
                    <p key={index}>{item}</p>
                ))}
            </div>
            <div>
                <p>Total Number of Characters 1: {numberOfCharacters1}</p>
                <p>Total Number of Characters 2: {numberOfCharacters2}</p>
            </div>
        </div>
    )

} // export const UseMemoSample

