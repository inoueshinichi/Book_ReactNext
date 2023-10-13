import React, { useState, createContext, useContext } from "react";
import ReactDOM from "react-dom/client";

// コンテキストを定義
const Context = createContext({
    // カウンター値
    count: 0
});

function AppContextAPI(props) {
    const [count, setCount] = useState(0);

    const handleAddCount = () => {
        setCount((prevCounter) => prevCounter + 1);
    };

    return (
        <>
            <div>AppContextAPI</div>
            <Context.Provider value={{count}}>
                {/* Provider プロパティに共有したいstateを定義 */}
                <button onClick={handleAddCount}>+1</button>
                <ChildComponent />
            </Context.Provider>
        </>
    );
}

const ChildComponent = () => {
    // useContextを使用して、親コンポーネントの状態を取得
    const { count } = useContext(Context);
    return <p>countの数値は{count}です.</p>;
}

export default AppContextAPI;