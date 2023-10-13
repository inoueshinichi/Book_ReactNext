import React, { useState } from "react";
import ReactDom from "react-dom/client";

import AppContextAPI from "./AppContextAPI";
import AppUseReducer from "./AppUseReducer";


function App() {
    return (
        <>
            <AppContextAPI />
            <AppUseReducer />
        </>
    );
}

export default App;