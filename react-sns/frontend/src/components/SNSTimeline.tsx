// SNS Timeline 画面

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

type TimeLine = {
    id: number;
    timestamp: Date;
    comment: string;
};

async function loadTimeline(
    userid: string,
    token: string,
    maxNum: number
): Promise<Array<TimeLine>> {

    // クエリ
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userid', /* ユーザID */userid);
    urlSearchParams.append('token', /* 認可トークン */token);
    urlSearchParams.append('maxNum', /* 取得等タイムライン数 */maxNum.toString());
    const query = '?' + urlSearchParams;

    // リソース
    const resourcePath: string = '/api/get_timeline';

    // URL
    let url: string = snsServerConfig.origin;
    url += resourcePath;
    url += query;

    console.log('[Timeline URL]', url);

    const acReqMethods: string[] = ['GET'];
    const acReqHeaders: string[] = ['Content-Type'];

    let reqHeaders = new Headers();
    reqHeaders.set('Access-Control-Request-Methods', acReqMethods.join(','));
    reqHeaders.set('Accept', 'application/json; charset=utf-8');
    reqHeaders.set('Content-Type', 'application/json; charset=utf-8');
    reqHeaders.set('Access-Control-Request-Headers', acReqHeaders.join(','));

    let timelineList: TimeLine[] = [];

    console.log(`[START] fetch API: ${url}`);
    await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        redirect: 'follow',
        referrer: "about:client",
        referrerPolicy: 'strict-origin-when-cross-origin',
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
            timelineList = resJsonObj.timelineList;
        } else {
            const errMsg: string = resJsonObj.msg;
            console.log('Error]', errMsg);
        }
    })
    .catch((err: Error) => {
        console.error(err.message);
    })
    .finally(() => {
        console.log(`[DONE] fetch API: ${url}`);
    });

    return timelineList;
}

function SNSTimeline() {

    // ログイン中のアカウント情報
    const accountUserInfo = useContext(AccountInfoContext);
    const userid: string = accountUserInfo.userid;
    const token: string = accountUserInfo.token;

    // // SNSApp画面のログイン情報のレンダリング
    // onNotifyLogin({
    //     login: accountUserInfo.login,
    //     userid: accountUserInfo.userid,
    //     token: accountUserInfo.token
    // }); // 無限ループレンダリング

    // 状態
    const [timelines, setTimelines] = useState<TimeLine[]>([]);


    useLayoutEffect(() => {
        // 即時関数
        (async () => {
            // タイムライン一覧を取得
            const timelineList = await loadTimeline(userid, token, /*maxNum*/20);
            console.log('[TimelineList]', timelineList);
            setTimelines(timelineList);
        })();

        /* Unmount時のクリーンアップ */
        return () => {
            /* nothing */
        };
    }, /*空配列で初回時のみ実行する*/[]);

    const timelineList: React.ReactNode[] = timelines.map(elem => {
        const id: number = elem.id;
        const timestamp: Date = elem.timestamp;
        const comment: string = elem.comment;

        return (
            <li key={id}>
                <p>id: {id} タイムスタンプ: {timestamp.toString()}</p>
                <p>{comment}</p>
                <br />
            </li>
        );
    });

    return (
        <>
            {/* <p>まだなにもないよ</p> */}
            <div className="timeline-list">
                <h2>自分のタイムライン</h2>
                <ul>{timelineList}</ul>
            </div>
        </>
    );
}

export default SNSTimeline;

