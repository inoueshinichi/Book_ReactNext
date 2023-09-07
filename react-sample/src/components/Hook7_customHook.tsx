// ユーザー独自のカスタムフック
// フックは, ループ・条件分岐・コールバック関数の中でコールすることができない.
// 描画毎に呼び出されるフックの数とコード内のフック記述の順番を同じにするため.
// 解決策: フックを使用する関数を新定義して, 関数コンポーネントのトップレベルで呼び出す.
import React, { useState, useCallback, useDebugValue } from 'react';

// カスタムフック(状態変数とコールバックの組合せ)
// input向けにコールバックと現在の入力内容をまとめたフック
const useInput = () => {

    // 現在の入力値を保持するフック
    const [state, setState] = useState<string>('');

    // inputが変化したらフック内の状態を更新する
    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setState(e.target.value);
    }, []);

    // デバッグ用に値を出力する
    // 値は, 開発者ツールのComponentタブに表示される
    useDebugValue(`Input: ${state}`);

    // 現在の入力内容とコールバックだけを返す(カスタム化)
    return [state, onChange] as const;
}

export const Input = (): JSX.Element => {
    // カスタムフック
    const [text, onChangeText] = useInput();
    return (
        <>
            <div>
                <input type="text" value={text} onChange={onChangeText} />
                <p>Input: {text}</p>
            </div>
        </>
    );
}

