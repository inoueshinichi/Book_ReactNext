// SNS Users 画面

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

import { snsServerConfig } from '../snsServerConfig';
import { AccountInfoContext } from '../SNSApp';

// useEffectは, classコンポーネントの下記と同じ機能を実現する
// 1. componentDidMount
// 2. componentDidUpdate
// 3. componentWillUnmount

// useLayoutEffectは, classコンポーネントの下記と同じ機能を実現する
// 1. componentWillMount
// 2. componentWillReceiveProps
// 3. shouldComponentUpdate
// 4. componentWillUpdate

async function loadUsers(userid: string, token: string): Promise<string[]> {
    console.log('userid', userid);
    console.log('token', token);

    // クエリ
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userid', /* ユーザID */userid);
    urlSearchParams.append('token', /* 認可トークン */token);
    const query = '?' + urlSearchParams;

    // リソース
    const resourcePath = '/api/get_allusers';

    // URL
    let url: string = snsServerConfig.origin;
    url += resourcePath;
    url += query;

    console.log('[Users URL]', url);

    const acReqMethods: string[] = ['GET'];
    const acReqHeaders: string[] = ['Content-Type'];

    let reqHeaders = new Headers();
    reqHeaders.set('Access-Control-Request-Methods', acReqMethods.join(','));
    reqHeaders.set('Accept', "application/json; charset=utf-8");
    reqHeaders.set('Content-Type', 'application/json; charset=utf-8');
    reqHeaders.set('Access-Control-Request-Headers', acReqHeaders.join(','));

    let userIdList: string[] = [];

    console.log(`[START] fetch API: ${url}`);
    await fetch(url, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
        redirect: "follow",
        referrerPolicy: "origin",
        headers: reqHeaders
    })
        .then((res: Response) => {
            if (!res.ok) {
                return new Error(`Response status: ${res.ok}`);
            }
            console.log('[Res Headers]', res.headers);
            console.log('[Res Body]', res.body);

            // 下記のMIMEタイプを受信できた場合, 次のthenメソッドの遷移する.
            // Content-Type: application/json; charset=utf-8
            return res.json();
        })
        .then((resJsonObj: any) => {
            console.log('resJsonObj', resJsonObj);

            if (resJsonObj.status) {
                userIdList = resJsonObj.userIdList;
            } else {
                const errMsg: string = resJsonObj.msg;
                console.log("[Error]", errMsg);
            }
        })
        .catch((err: Error) => {
            console.error(err.message);
        })
        .finally(() => {
            console.log(`[DONE] fetch API: ${url}`);
        });

    return userIdList;
};

function SNSUsers() {

    // ログイン中のアカウント情報
    const accountUserInfo = useContext(AccountInfoContext);
    const login: boolean = accountUserInfo.login;
    const userid: string = accountUserInfo.userid;
    const token: string = accountUserInfo.token;

    // // SNSApp画面のログイン情報のレンダリング
    // onNotifyLogin({
    //     login: login,
    //     userid: accountUserInfo.userid,
    //     token: accountUserInfo.token
    // }); // 無限ループレンダリング

    const [users, setUsers] = useState<string[]>([]);

    
    useLayoutEffect(() => {

        // useLayoutEffectは, クリーンアップ関数を戻り値にする必要があるため,
        // 非同期処理を含む場合は即時関数を使う
        (async () => {
            console.log('[START] useLayoutEffect');
            console.log('[Contenxt UserID]', userid);
            console.log('[SessionStorage UserID]', window.sessionStorage.getItem(`userid_${userid}`));
            console.log('[Contenxt Token]', token);
            console.log('[SessionStorage Token]', window.sessionStorage.getItem(`token_${userid}`));

            // すべてのユーザの一覧を取得 (非同期をawaitしていないのでデータ取得前に処理が走って抜けてしまうかも...)
            const users: string[] = await loadUsers(userid, token);
            console.log('[Users]', users);
            setUsers(users);
        })();

        /* Unmount時のクリーンアップ */
        return () => {
            /* nothing */
        };
    }, /*空配列で初回時のみ実行する*/[]);

    const userList: React.ReactNode[] = users.map(userid => {
        const cell = <li key={userid}>{userid}</li>;
        return cell;
    });

    return (
        <>
            <h2>ユーザ一覧</h2>
            <ul>{userList}</ul>
        </>
    );
}

export default SNSUsers;