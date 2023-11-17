import React from 'react';
import ReactDOM from 'react-dom/client';

// Hello App
import HelloApp from './components/HelloApp';

// Prefectures App
import PrefectureApp from './components/PrefectureApp';

console.log(document.getElementById('root_prefecture'));

// React <= 17
// ReactDOM.render(
//     <HelloApp />,
//     document.getElementById('root_index')
// );

// Recomend : React > 18.x
// const root_hello = ReactDOM.createRoot(
//     document.getElementById('root_hello')
// );
// root_hello.render(<HelloApp />);
// root.render(<div>テストです</div>);

const root_prefecture = ReactDOM.createRoot(
    document.getElementById('root_prefecture')
);
root_prefecture.render(<PrefectureApp />);
// root_prefecture.render(<p>描画テスト</p>);