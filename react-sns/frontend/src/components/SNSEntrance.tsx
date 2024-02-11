// SNS エントランス画面

import React, {
    useState,
    useLayoutEffect,
    useEffect,
    useContext,
    useMemo,
    memo,
    useCallback,
    useRef,
    useReducer,
} from 'react';
import ReactDOM from 'react-dom/client';
import {
    Link
} from 'react-router-dom';

import { snsServerConfig } from '../snsServerConfig';
import { AccountInfoContext } from '../SNSApp';

function SNSEntrance() {

    // // ログイン中のアカウント情報
    // const accountUserInfo = useContext(AccountInfoContext);
    // const login: boolean = accountUserInfo.login;
    // const userid: string = accountUserInfo.userid;
    // const token: string = accountUserInfo.token;

    // SNSApp画面のログイン情報のレンダリング
    // onNotifyLogin({
    //     login: login,
    //     userid: accountUserInfo.userid,
    //     token: accountUserInfo.token
    // }); // 無限ループレンダリング

    console.log("[Entrance]");
    return (
        <React.Fragment>
            <h2>玄関の画面</h2>
            <Link to='/login'>Login</Link>
            <h2>ユーザ一覧</h2>
            <Link to='/users'>Users</Link>
        </React.Fragment>
    )
}

export default SNSEntrance;