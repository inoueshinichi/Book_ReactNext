// 自分SNSアプリのメイン

import React from 'react';
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
import SNSUsers from './components/SNSUsers';
import SNSTimeline from './components/SNSTimeline';

function SNSApp() {
  return (
    <>
      <div className="SNS-header">SNS Application</div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SNSEntrance />} />
          <Route path='/login' element={<SNSLogin />} />
          <Route path='/signup' element={<SNSSignup />} />
          <Route path='/users' element={<SNSUsers />} />
          <Route path='/timeline' element={<SNSTimeline />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default SNSApp;
