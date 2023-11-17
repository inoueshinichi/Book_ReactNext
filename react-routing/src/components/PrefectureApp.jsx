import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useParams
} from 'react-router-dom';

import NoMatch from './nomatch';

// 県の情報
const preferences = [
    { id: 1, name: '福岡県', info: "北部九州" },
    { id: 2, name: '長崎県', info: '西部九州' },
    { id: 3, name: '大分県', info: '東部九州' },
    { id: 4, name: '鹿児島県', info: '南部九州' }
];

// メイン
const PrefectureApp = () => {
    return (

        <div style={{ margin: 20 }}>
            <div>
                <Router>
                    <Routes>
                        <Route exact path='/' element={<PrefList />} />
                        <Route path='/pref/:id' element={<PrefCard />} />
                        <Route path="*" element={<NoMatch />} />
                    </Routes>
                </Router>
            </div>
        </div>

    );
};

// 県一覧を表示する
class PrefList extends React.Component {
    render() {
        const pList = preferences.map(e => {
            const target = `/pref/${e.id}`;
            return (
                <li key={e.id}>
                    <Link to={target} >{e.name}</Link>
                </li>
            );
        });
        return <ul>{pList}</ul>;
    }
}

// 県の詳細
const PrefCard = () => {
    // const { params } = this.props.match; // /pref/:id のidが取得できる
    const params = useParams();
    console.log(params);
    const ID = parseInt(params.id, 10);
    const pref = preferences.filter(e => e.id === ID)[0];
    return (
        <div>
            <div>{ID}: {pref.name} - {pref.info}</div>
            <div><Link to='/'>→戻る</Link></div>
        </div>
    );
}


export default PrefectureApp;