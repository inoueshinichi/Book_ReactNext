import React, { useReducer } from "react";
import ReactDOM from "react-dom/client";

// Reducerで使用する初期値
const initialState = 0;

// Action
const reducer = (count = initialState, action) => {
    switch (action.type) {
        case "add_count":
            const newCount = count + 1;
            return newCount;
        default:
            return count;
    }
};

function AppUseReducer(props) {
    // useReducerを使ってstateとdispatch関数を呼び出す
    const [count, dispatch] = useReducer(reducer, initialState);

    const handleAddCount = () => {
        dispatch({ type: 'add_count', palyload: count});
    };

    return (
        <>
            <div>AppUseReducer</div>
            <button onClick={handleAddCount}>+1</button>
            <p>{count}</p>
        </>
    );
}

export default AppUseReducer;

