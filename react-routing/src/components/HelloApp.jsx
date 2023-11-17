import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Routes
} from 'react-router-dom';

import NoMatch from './nomatch';
import HelloJapanese from "./ja";
import HelloEnglish from "./en";
import HelloChinese from "./cn";

// React Routerを使ったメインコンポーネントの定義
const HelloApp = () => {
    return (
        <>
        <h1>React Router V6</h1>
        <Router>
            <Routes>
                <Route exact path='/' element={<Home />} />
                <Route path='/ja' element={<HelloJapanese />} />
                <Route path='/en' element={<HelloEnglish />} />
                <Route path='/cn' element={<HelloChinese />} />
                <Route path="*" element={<NoMatch />} />
            </Routes>
        </Router>  
        </>
    );
};

// ホーム画面を表すコンポーネントを定義
const Home = () => {
    return (
        <div>
            <p>言語を選択してください</p>
            <ul>
                {/* <li><a href='/ja'>日本語</a></li>
                <li><a href='/en'>英語</a></li>
                <li><a href='/cn'>中国語</a></li> */}
                <li><Link to="/ja">日本語</Link></li>
                <li><Link to="/en">英語</Link></li>
                <li><Link to="/cn">中国語</Link></li>
            </ul>
        </div>
    );
};


export default HelloApp;