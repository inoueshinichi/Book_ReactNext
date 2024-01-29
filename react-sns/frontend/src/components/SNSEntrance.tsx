// SNS エントランス画面

import React, {
    useState,
    useLayoutEffect,
    useEffect,
    useContext,
    useMemo,
    memo,
    useCallback,
    useRef,
    useReducer,
} from 'react';
import ReactDOM from 'react-dom/client';
import {
    Link
} from 'react-router-dom';

function SNSEntrance() {
    return (
        <React.Fragment>
            <h1>玄関の画面</h1>
            <Link to='/login'>Login</Link>
        </React.Fragment>
    )
}

export default SNSEntrance;