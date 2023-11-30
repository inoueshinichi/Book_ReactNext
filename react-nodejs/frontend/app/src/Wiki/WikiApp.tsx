import React from "react";
import ReactDom from "react-dom/client";

// React Router DOM
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
} from 'react-router-dom';

import WikiShow from "./WikiShow";
import WikiEdit from "./WikiEdit";


// Wiki アプリ
const WikiApp = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/wiki/:name" element={<WikiShow />} />
                <Route path="/edit/:name" element={<WikiEdit />} />
            </Routes>
        </BrowserRouter>
    );
};

export default WikiApp;
