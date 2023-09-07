/** HTMLタグ, CSSスタイルシート での構成
 * <div style='padding: 16px; background-color: grey;'>
 *   <label for="name">名前</label>
 *   <input id="name" class="input-name" type="text">
 * </div>
 */

// 上記の構成要素をJSXで記述する

import React from 'react'

// 名前を入力するためのテキストボックスを返す
const Name = (): JSX.Element => {
    // input要素のonchangeイベントに対するコールバック関数を定義する
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 入力されたテキストをコンソールに表示する
        console.log(e.target.value);
    };

    return (
        // styleオブジェクトのキーはキャメルケースになる
        <div style={{padding: '16px', backgroundColor: 'grey'}}>
            {/* forの代わりにhtmlForを使う */}
            <label htmlFor="name">名前</label>
            {/* classやonchangeの代わりにclassNameやonChangeを使う */}
            <input id="name" className="input-name" type="text" onChange={onChange}></input>
        </div>
    );
}

export default Name;