// ミュータブルなデータの保持, DOMの参照を扱う useRef
// 描画に関係のない変数を扱うことが目的
// 使用頻度高い

import React, { useState, useRef } from "react";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const UPLOAD_DELAY = 5000;

export const ImageUploader = () => {
    // 隠されたinput要素にアクセスするためのref
    const inputImageRef = useRef</*<input>の仮想DOM*/HTMLInputElement | null>(null);

    // 選択されたファイルデータを保持するref
    const fileRef = useRef<File | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // 「画像をアップロード」というテキストがクリックされた時のコールバック
    const onClickText = () => {
        if (inputImageRef.current != null) {
            // inputのDOMにアクセスして、クリックイベントを発火する
            inputImageRef.current.click(); // dom.click()
        }
    };

    // ファイルが選択された後に呼ばれるコールバック
    const onChangeImage = (e: React.ChangeEvent</*<input>の仮想DOM*/HTMLInputElement>) => {
        const files = e.target.files;
        if (files != null && files.length > 0) {
            // fileRef.currentに値を保持する
            // fileRef.currentが変化しても再描画は発生しない
            fileRef.current = files[0];
        }
    };

    // アップロードボタンがクリックされた時に呼ばれるコールバック(非同期)
    const onClickUpload = async () => {
        if (fileRef.current != null) {
            // 通常は, ここでAPIを読んでファイルをサーバーにアップロードする
        
            await sleep(UPLOAD_DELAY); // ここでは擬似的に一定時間待つ

            // アプロードが成功した旨を表示するために, メッセージを書き換える
            setMessage(`${fileRef.current.name} has been successfully uploaded`);
        }
    };

    return (
        <div>
            <p style={{ textDecoration: 'underline' }} onClick={onClickText}>画像をアップロードする</p>
            <input ref={inputImageRef} type="file" accept="image/*" onChange={onChangeImage} style={{ visibility: 'hidden' }} />
            <br />
            <button onClick={onClickUpload}>アップロードする</button>
            {message !== null && <p>{message}</p>}
        </div>
    )
}

