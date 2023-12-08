import React from "react";
import ReactDom from "react-dom/client";

// React Router DOM
import {
    BrowserRouter,
    // Routes, // react-router-dom v6
    Switch, // react-router-dom v5
    Route,
    Link,
} from 'react-router-dom';

import WikiShow from "./WikiShow";
import WikiEdit from "./WikiEdit";


// Wiki アプリ
const WikiApp = () => {
    console.log("Wiki App");
    return (
        <BrowserRouter>
            {/* <Routes> */}
            <Switch>
                <Route exact path="/" component={WikiShow} />
                <Route path="/wiki/:name" component={WikiShow} />
                <Route path="/edit/" component={WikiEdit} />
                <Route path="/edit/:name" component={WikiEdit} />
            </Switch>
            {/* </Routes> */}
        </BrowserRouter>
    );
};

export default WikiApp;
