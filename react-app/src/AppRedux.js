// Reduxを用いた状態管理するアプリ

import React, { useState } from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { createStoreHook } from "react-redux";

// Storeに登録する状態の初期値
const initialState = { count: 0};

// Action用のReducerを定義
const countReducer = (state = initialState, action) => {
    switch (action.type) {
        // 「add_count」というActionが発行されたらstateを更新して返却
        case "add_count":
            const newCount = state.count + 1;
            return { count: newCount };
        default:
            return state;
    }
};

// 内部アプリ(ReduxStoreの影響下にある)
function AppRedux() {
    // react-reduxによりDispatchを行うフックを呼び出す
    const dispatch = useDispatch();
    // react-reduxによりuseSelector()のフックでstateを抽出する
    const count = useSelector((state) => state.count);
    // ボタンを押したときにDispatch関数を呼び出すイベント
    const handleAddCount = () => {
        dispatch({ type: "add_count" });
    };

    return (
        <div>
            <button onClick={handleAddCount}>+1</button>
            <p>{count}</p>
        </div>
    );
}

// createStore()関数に作成したReducerを渡す
const globalStore = createStoreHook(countReducer);

// カウンターアプリケーション
ReactDOM.render(
        // Providerでラッピングしてアプリ全体(InternalAppEffectReduxStore)にStoreを設定
        <Provider store={globalStore}>
            <AppRedux />
        </Provider>,
        document.getElementById("root1")
);
