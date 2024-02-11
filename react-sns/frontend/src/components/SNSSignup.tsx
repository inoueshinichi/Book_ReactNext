// SNS Signup 画面

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
} from "react-router-dom";


import { snsServerConfig } from '../snsServerConfig';
import { AccountInfoContext } from '../SNSApp';

type UserSignupForm = {
    userid: string;
    passwd: string;
    name: string;
};

function SNSSignup() {

    // 状態
    const [userSignupForm, setUserSignupForm] = useState<UserSignupForm>({
        userid: '', passwd: '', name: ''
    });
    const [message, setMessage] = useState<string>('');

    // リダイレクト機能
    const navigate = useNavigate();

    const handleChangeSignupUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserSignupForm({
            ...userSignupForm,
            userid: e.target.value
        });
    };

    const handleChangeSignupPasswd = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserSignupForm({
            ...userSignupForm,
            passwd: e.target.value
        });
    };

    const handleChangeSignupName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserSignupForm({
            ...userSignupForm,
            name: e.target.value
        });
    };


    const handleSignup = (e: React.MouseEvent<HTMLButtonElement>) => {

        // クエリ作成
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('userid', userSignupForm.userid);
        urlSearchParams.append('passwd', userSignupForm.passwd);
        urlSearchParams.append('username', userSignupForm.name);
        const query = '?' + urlSearchParams;

        const resourcePath = '/api/adduser';

        // URL作成
        let url: string = snsServerConfig.origin;
        url += resourcePath;
        url += query;

        console.log('[Signup URL]', url);

        // リクエストヘッダ
        let reqHeaders = new Headers();
        reqHeaders.set('Access-Control-Request-Methods', 'POST');
        reqHeaders.set('Content-Type', 'application/json; charset=utf-8');

        // Referrer-Policyは, HTTPリクエストヘッダで
        // リファラー情報をどれだけ含めるかを制御する
        /*
            no-referrer : リファラ情報を含めない
            no-referrer-when-downgrade : セキュリティ水準が同一or向上する場合(HTTP->HTTP, HTTP->HTTPS, HTTPS->HTTPS), [オリジン,パス,クエリ]をリファラヘッダに含める. 
                                         セキュリティ水準が低下する場合(HTTP->file, HTTPS->file), リファラヘッダを送信しない.
            origin : オリジンのみをリファラヘッダに含める. 
            origin-when-cross-origin : セキリティ水準が同一(HTTP->HTTP, HTTPS->HTTPS) and 同一オリジンの場合, [オリジン,パス,クエリ]をリファラヘッダに含める.
                                       セキュリティ水準が低下する場合 or クロスオリジンの場合, リファラヘッダをオリジンのみにする.
            same-origin : 同一オリジンの場合, [オリジン,パス,クエリ]をリファラヘッダに含める. それ以外は, リファラヘッダを送信しない.
            strict-origin : セキリティ水準が同一(HTTP->HTTP, HTTPS->HTTPS)の場合のみ, リファラヘッダにオリジンを含める. それ以外はリファラヘッダを送信しない.
            strict-origin-when-cross-origin (default) : 同一オリジンの場合, [オリジン,パス,クエリ]をリファラヘッダに含める. 
                                                        クロスオリジンの場合, セキリティ水準が同一(HTTP->HTTP, HTTPS->HTTPS)に限り, オリジンをリファラヘッダに含めて送信する.
            unsafe-url : (危険) どのようなリクエストに対しても[オリジン,パス,クエリ]をリファラヘッダに含めて送信する.
        */

        // fetch API
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
            let statusMsg: string = `userid: ${userSignupForm.userid}, passwd: ${userSignupForm.passwd}, name: ${userSignupForm.name} : `;
            if (isStatus) {
                statusMsg += resJsonObj.msg;
            } else {
                statusMsg = resJsonObj.msg;
            }
            setMessage(resJsonObj.msg);

            // 1秒後にリダイレクト
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(() => {
            console.log(`[DONE] fetch API to ${url}`);
        });
    };


    return (
        <React.Fragment>
            <h2>サインアップ</h2>
            <div className="サインアップ">
                ユーザID:
                <input type="text"
                    value={userSignupForm.userid}
                    onChange={(e) => handleChangeSignupUserId(e)}
                />
                <br />
                ユーザ名:
                <input type="text"
                    value={userSignupForm.name}
                    onChange={(e) => handleChangeSignupName(e)}
                />
                <br />
                パスワード:
                <input type="text"
                    value={userSignupForm.passwd}
                    onChange={(e) => handleChangeSignupPasswd(e)}
                />
                <br />
                <button onClick={(e) => handleSignup(e)}>登録</button>
                <br />
                <p>状態: {message}</p>
            </div>
        </React.Fragment>
    );
}

export default SNSSignup;