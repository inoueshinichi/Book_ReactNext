import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import App1 from './App1_for_root1';
import App2 from './App2_for_root2';
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// webpackを使うと, id='root'のルート一つでしか対応してくれない.
// 下記のrootを2つ設定する方法だとUIが表示されされない.

// const root1 = document.getElementById('root1');
// ReactDOM.render(
//   <React.StrictMode>
//     <App1 />
//   </React.StrictMode>,
//   root1
// );

// const root2 = document.getElementById('root2');
// ReactDOM.render(
//   <React.StrictMode>
//     <App2 />
//   </React.StrictMode>,
//   root2
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
