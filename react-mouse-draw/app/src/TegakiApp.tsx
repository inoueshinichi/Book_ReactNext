// 3rd 
import React , {
  useContext,
  useState,
  useLayoutEffect,
  useEffect,
  useMemo,
  memo,
  useCallback,
  useRef,
  useReducer
} from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate
} from 'react-router-dom'

// TegakiApp
import logo from './logo.svg';
import './TegakiApp.css';

// components
import TegakiDraw from './components/TegakiDraw';

function TegakiApp() {
  return (
    <div className="TegakiApp">
      <header className="App-header">
        <title>手書き数字をマウスで描くアプリ</title>
      </header>

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<TegakiDraw />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default TegakiApp;
