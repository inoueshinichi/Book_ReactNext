// 自分SNSアプリのメイン

import React, {
  useContext,
  useState
} from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from 'react-router-dom';

import './SNSApp.css';

// components
import SNSEntrance from './components/SNSEntrance';
import SNSLogin from './components/SNSLogin';
import SNSSignup from './components/SNSSignup';
import SNSFriends from './components/SNSFriends';
import SNSUsers from './components/SNSUsers';
import SNSTimeline from './components/SNSTimeline';

type AccountInfo = {
  login: boolean;
  userid: string;
  token: string;
};

// React Routerで共通の状態
export const AccountInfoContext = React.createContext<AccountInfo>(
  // 初期値
{
  login: false,
  userid: "",
  token: ""
});


function SNSApp() {

  const accountInfo = useContext(AccountInfoContext);

  // 状態
  const [loginStatus, setLoginStatus] = useState<AccountInfo>({
    login: false,
    userid: "",
    token: ""
  });

  const handleNotifyLogin = (accountInfo: AccountInfo) => {
    setLoginStatus(accountInfo);
  };

  let loginBlock =
    <div className="status-logout">
      ログインID : ログインできていません
      <br />
      トークン : 発行されていません
      <br />
    </div>;

  if (loginStatus.login) {
    loginBlock = 
      <div className="status-login">
        ログインID : {loginStatus.userid}
        <br />
        トークン : {loginStatus.token}
        <br />
      </div>;
  }

  return (
    // Contextに値を渡す
    <AccountInfoContext.Provider value={accountInfo}>
      <>
        <h1 className="SNS-header">SNS Application</h1>
        <a href="http://localhost:3300/redirect/home">初期画面に戻る</a>
        <br />

        <h3>ログイン状態</h3>
        {loginBlock}

        <BrowserRouter>
          <Routes>
            <Route path='/' element={<SNSEntrance />} />
            <Route path='/login' element={<SNSLogin onNotifyLogin={handleNotifyLogin} />} />
            <Route path='/signup' element={<SNSSignup />} />
            <Route path='/friends' element={<SNSFriends />} />
            <Route path='/users' element={<SNSUsers />} />
            <Route path='/timeline' element={<SNSTimeline />} />
          </Routes>
        </BrowserRouter>
      </>
    </AccountInfoContext.Provider>
  );
}

export default SNSApp;
