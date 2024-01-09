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

type UserProfile = {
    origin: string;
    userid: string;
    passwd: string;
};

// ログイン画面
function SNSLogin() {

    const [userProfile, setUserProfile] = useState<UserProfile>({
        origin: '',
        userid: '',
        passwd: '',
    });

    const [message, setMessage] = useState<string>('');

    const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {

    };

    // const handleChangeState = (name: string, e: React.ChangeEvent) => {

    // };

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

    const handleSignup = (e: React.MouseEvent<HTMLButtonElement>) => {
        // サインアップ画面に遷移
    };


    useLayoutEffect(() => {
        const XHR = new XMLHttpRequest();
        XHR.open('GET', userProfile.origin, /*非同期*/true);
        XHR.withCredentials = true; // Cookieと認証ヘッダーを許可
        XHR.setRequestHeader('Access-Control-Request-Methods', 'GET');
        XHR.setRequestHeader('Content-Type', 'application/json');
        
    }, []);

    

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
                <p><button onClick={e => handleSignup(e)}>Signup</button></p>
            </div>
        </div>
    );
}

export default SNSLogin;