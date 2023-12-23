// Scaffold of App
// import { useEffect, useLayoutEffect, useState, useRef } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Link
} from 'react-router-dom';

import Users from "./Users";

// '/'のときの表示
function Top() {
    return <div>Top</div>;
}

function Monorepo() {
    return <div>/monorepo</div>
}

function App() {
    return (
        <BrowserRouter>
            {/* ページ上部にナビゲーションリンクを設置 */}
            <nav>
                <ul>
                    <li>
                        <Link to="/">Top</Link>
                    </li>
                    <li>
                        <Link to="/monorepo">Monorepo</Link>
                    </li>
                    <li>
                        <Link to="/users">Users</Link>
                    </li>
                    <li>
                        <a href="/index.html">Users with a href</a>
                    </li>
                </ul>
            </nav>
            <Routes>
                <Route path="/" element={<Top />} />
                <Route path="/monorepo" element={<Monorepo />} />
                <Route path="/users" element={<Users />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;