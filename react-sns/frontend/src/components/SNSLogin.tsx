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

import { snsServerConfig } from '../snsServerConfig';

type UserProfile = {
    userid: string;
    passwd: string;
};

// ログイン画面
function SNSLogin() {

    const [userProfile, setUserProfile] = useState<UserProfile>({
        userid: '',
        passwd: '',
    });

    const [message, setMessage] = useState<string>('');

    const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {

        // クエリ作成
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('userid', userProfile.userid);
        urlSearchParams.append('passwd', userProfile.passwd);

        // URL作成
        const url: string = snsServerConfig.origin + '/' + urlSearchParams.toString();

        // XHR (CORS許可)
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, /*非同期*/true);
        xhr.withCredentials = true; // Cookieと認証ヘッダーを許可
        xhr.setRequestHeader('Access-Control-Request-Methods', 'GET');
        xhr.setRequestHeader('Content-Type', 'application/json');

        // コールバック
        xhr.onload = (e) => {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    console.log(`[SUCCESS] ${xhr.status} to ${url}`);
                    // responseType: "blob", "document", "json", "text"
                    if (xhr.responseType == "json") {
                        console.log("[Response Type] json");
                        const resJsonObj = JSON.parse(xhr.response);

                        /* 認可Tokenをwindow.sessionStorage(localStorage:5MB)に保存 */
                        window.sessionStorage.setItem('token', resJsonObj.token);
                    }
                    else {
                        console.log("[Response Type] NOT json");
                    }
                } else {
                    console.log("[Response Status]", xhr.status);
                }
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
        // サインアップ画面に遷移 (リクエスト)
        window.location.replace(`${snsServerConfig.origin}/redirect/signup`);

    };

    return (
        <div>
            <h1>ログイン</h1>
            <div className="login">
                ユーザID:<br />
                <input type="text" value={userProfile.userid} onChange={e => handleChangeUserId(e)} />
                <br />
                パスワード:<br />
                <input type="passowrd" value={userProfile.passwd} onChange={e => handleChangePasswd(e)} />
                <button onClick={e => handleLogin(e)}>ログイン</button>
                <br />
                <p className="login-error">{message}</p>
                <p><button onClick={e => handleRedirectSignup(e)}>Signup</button></p>
            </div>
        </div>
    );
}

export default SNSLogin;