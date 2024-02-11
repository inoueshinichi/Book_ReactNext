// SNS Friends 画面

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
    Link,
    useNavigate,
} from "react-router-dom";

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

async function loadFriends(userid: string, token: string): Promise<Array<{ string: boolean }>> {

    // クエリ
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userid', /* ユーザID */userid);
    urlSearchParams.append('token', /* 認可トークン */token);
    const query = '?' + urlSearchParams;

    // リソース
    const resourcePath: string = '/api/get_friends';

    // URL
    let url: string = snsServerConfig.origin;
    url += resourcePath;
    url += query;

    console.log('[Friends URL]', url);

    const acReqMethods: string[] = ['GET'];
    const acReqHeaders: string[] = ['Content-Type'];

    let reqHeaders = new Headers();
    reqHeaders.set('Access-Control-Request-Methods', acReqMethods.join(','));
    reqHeaders.set('Accept', "application/json; charset=utf-8");
    reqHeaders.set('Content-Type', 'application/json; charset=utf-8');
    reqHeaders.set('Access-Control-Request-Headers', acReqHeaders.join(','));

    let friendStatusList: Array<{ string: boolean }> = [];

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
                friendStatusList = resJsonObj.friends;
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

    return friendStatusList;
};

function SNSFriends() {

    // ログイン中のアカウント情報
    const accountUserInfo = useContext(AccountInfoContext);
    const login: boolean = accountUserInfo.login;
    const userid: string = accountUserInfo.userid;
    const token: string = accountUserInfo.token;

    // // SNSApp画面のログイン情報のレンダリング
    // onNotifyLogin({
    //     login: accountUserInfo.login,
    //     userid: accountUserInfo.userid,
    //     token: accountUserInfo.token
    // }); // 無限ループレンダリング

    // 状態
    // const [addedFriendCount, setAddedFrinedCount] = useState<number>(0);
    const [friends, setFriends] = useState<Array<{ string: boolean }>>([]);
    const [wantToAddFriendId, setWatToAddFriendId] = useState<string>('');
    const [addFriendFlag, setAddFriendFlag] = useState<boolean>(false);

    const handleChangeFriendId = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWatToAddFriendId(e.target.value);
    };

    const handleAddFriendId = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        // クエリ作成
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('userid', userid);
        urlSearchParams.append('token', token);
        urlSearchParams.append('friendid', wantToAddFriendId);
        const query = '?' + urlSearchParams;

        const resourcePath = '/api/add_friend';

        // URL作成
        let url: string = snsServerConfig.origin;
        url += resourcePath;
        url += query;

        console.log('[Add Friend ID URL]', url);

        // リクエストヘッダ
        let reqHeaders = new Headers();
        reqHeaders.set('Access-Control-Request-Methods', 'POST');
        reqHeaders.set('Content-Type', 'application/json; charset=utf-8');

        fetch(url, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            redirect: "follow",
            referrer: "about:client",
            referrerPolicy: "strict-origin-when-cross-origin",
            headers: reqHeaders
        })
            .then((res: Response) => {
                if (res.ok) {
                    return res.json(); // Promise<JsonObj>
                } else {
                    return new Error(`[ErrorCode] ${res.status}, ${res.statusText}`);
                }
            })
            .then((resJsonObj: any) => {
                const isStatus = resJsonObj.status;
                const resMsg = resJsonObj.msg;
                let statusMsg: string = `userid: ${userid} : ${resMsg}`;
                console.log(statusMsg);

                // 再描画
                setAddFriendFlag(!addFriendFlag);
                // setAddedFrinedCount(addedFriendCount + 1);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                console.log(`[DONE] fetch API to ${url}`);
            });
    };


    useLayoutEffect(() => {

        // useLayoutEffectは, クリーンアップ関数を戻り値にする必要があるため,
        // 非同期処理を含む場合は即時関数を使う
        (async () => {
            console.log('[START] useLayoutEffect');
            console.log('[Contenxt UserID]', userid);
            // console.log('[SessionStorage UserID]', window.sessionStorage.getItem(`userid_${userid}`));
            console.log('[Contenxt Token]', token);
            // console.log('[SessionStorage Token]', window.sessionStorage.getItem(`token_${userid}`));

            // すべてのユーザの一覧を取得 (非同期をawaitしていないのでデータ取得前に処理が走って抜けてしまうかも...)
            const friends: Array<{ string: boolean }> = await loadFriends(userid, token);
            console.log('[Friends]', friends);
            setFriends(friends);
        })();

        /* Unmount時のクリーンアップ */
        return () => {
            /* nothing */
        };
    }, /*空配列で初回時のみ実行する*/[addFriendFlag]);

    console.log("Array.from(friends)", Array.from(friends));
    console.log("Object.entries(friends)", Object.entries(friends));
    const friendList: React.ReactNode[] = Object.entries(friends).map(friendInfo => {
        console.log("friendInfo", friendInfo);
        const userid = friendInfo[0];
        const isFollow = friendInfo[1];
        const follow = isFollow ?
            (<button style={{ display: 'inline-block' }} onClick={e => { }}>フォロー中</button>) :
            (<button style={{ display: 'inline-block' }} onClick={e => { }}>フォローする</button>);
        const cell = <li key={userid}>{userid} {follow}</li>;
        return cell;
    });

    return (
        <>
            <div className="friend-list">
                <h2>友人一覧</h2>
                <ul>{friendList}</ul>
            </div>
            
            <div className="my-timeline">
                <Link to='/timeline'>自分のタイムラインを見る</Link>
            </div>
            
            <div className="add-friend">
                <h2>友人の追加</h2>
                友人: <input type="text" onChange={(e) => handleChangeFriendId(e)}></input>
                <button onClick={handleAddFriendId}>友人追加</button>
                {/* 追加した友人数: {addedFriendCount} */}
            </div>
            <div className="remove-friend">
                <h2>友人の削除</h2>
        
            </div>
            
        </>
    );
}

export default SNSFriends;