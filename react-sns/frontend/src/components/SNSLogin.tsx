// SNS Login 画面

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
    useNavigate
} from 'react-router-dom';

import { snsServerConfig } from '../snsServerConfig';
import { AccountInfoContext } from '../SNSApp';

type UserProfile = {
    userid: string;
    passwd: string;
};

// ログイン画面
function SNSLogin({ onNotifyLogin }: any) {

    // ログイン中のアカウント情報
    const accountUserInfo = useContext(AccountInfoContext);

    // 状態
    const [userProfile, setUserProfile] = useState<UserProfile>({
        userid: '',
        passwd: '',
    });

    const [message, setMessage] = useState<string>('');

    // リダイレクト機能
    const navigate = useNavigate();

    const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {

        // クエリ作成
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('userid', userProfile.userid);
        urlSearchParams.append('passwd', userProfile.passwd);
        const query = '?' + urlSearchParams;

        const resourcePath = '/api/login';

        // URL作成
        let url: string = snsServerConfig.origin;
        url += resourcePath;
        url += query;

        console.log('[Login URL]', url);

        // XHR (CORS許可)
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, /*非同期*/true);
        xhr.withCredentials = true; // Cookieと認証ヘッダーを許可
        xhr.setRequestHeader('Access-Control-Request-Methods', 'GET');
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        xhr.responseType = "json"; // responseType: "blob", "document", "json", "text"

        // コールバック
        xhr.onload = (e) => {
            // https://github.com/inoueshinichi/Wiki_Web/wiki/Wiki_JS_Ajax
            // xhr.readyState
            // [0, `UNSENT`]
            // [1, 'OPENED']
            // [2, 'HEADERS_RECIEVED']
            // [3, 'LOADING'], [4, 'DONE']
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    console.log(`[SUCCESS] ${xhr.status} to ${url}`);
                    console.log("[Response Type] json");
                    // const resJsonObj = JSON.parse(xhr.response);
                    const resJsonObj = xhr.response;
                    console.log('resJosnObj', resJsonObj);

                    const userid = userProfile.userid;
                    const token = resJsonObj.token;

                    /* 認可Tokenをwindow.sessionStorageに保存 */
                    window.sessionStorage.setItem(`userid_${userProfile['userid']}`, userid);
                    window.sessionStorage.setItem(`token_${userProfile['userid']}`, token);
                
                    // アカウント状態を保存
                    accountUserInfo.userid = userid;
                    accountUserInfo.token = token;

                    console.log(`[SUCCESS] Login: userid: ${accountUserInfo!.userid}, token: ${accountUserInfo!.token}`);

                    setMessage(resJsonObj['status'] ? xhr.statusText : resJsonObj['msg']);

                    // リダイレクト
                    // window.location.replace(`${snsServerConfig.origin}/redirect/users`);
                    navigate('/friends');

                    // SNSApp画面のログイン情報のレンダリング
                    onNotifyLogin({
                        login: true,
                        userid: accountUserInfo.userid,
                        token: accountUserInfo.token
                    });
                }
            } else {
                console.log("[Response Status]", xhr.status);
            }
        };
        xhr.onerror = (e) => {
            console.log(xhr.statusText);
        };
        xhr.onabort = (e) => {
            console.log("[Abort]");
            console.error(e);
        };
        xhr.ontimeout = () => {
            console.log("[Timeout]");
            console.error(e);
        };
        xhr.onloadend = (e) => {
            console.log("[End] Ajax");
            if (xhr.status !== 200) {
                setMessage(xhr.statusText);
            }
        };

        // 送信
        xhr.send(null);
    };

    const handleChangeUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserProfile({
            ...userProfile,
            userid: e.target.value
        });
    };

    const handleChangePasswd = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserProfile({
            ...userProfile,
            passwd: e.target.value
        });
    };

    const handleRedirectSignup = (e: React.MouseEvent<HTMLButtonElement>) => {
        // サインアップ画面に(サーバ経由でリダイレクト)
        window.location.replace(`${snsServerConfig.origin}/redirect/signup`);
    };

    return (
        <div>
            <h2>ログイン</h2>
            <div className="login">
                ユーザID: 
                <input type="text"
                    value={userProfile.userid}
                    onChange={e => handleChangeUserId(e)}
                />
                <br />
                パスワード:
                <input type="test"
                    value={userProfile.passwd}
                    onChange={e => handleChangePasswd(e)}
                />
                <button onClick={e => handleLogin(e)}>ログイン</button>
                <br />
                <p className="login-error">{message}</p>
                <p><button onClick={e => handleRedirectSignup(e)}>Signup</button></p>
            </div>
        </div>
    );
}

export default SNSLogin;