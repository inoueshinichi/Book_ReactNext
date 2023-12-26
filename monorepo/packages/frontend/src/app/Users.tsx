import React from 'react';
import {
    useState,
    useEffect,
    useLayoutEffect,
    useRef,
    useContext,
    useCallback,
    memo,
    useMemo,
    useReducer,
    // useImplementiveHandle,
    useTransition,
    // useDefferedValue,
    // useIntersectionEffects,
    useDebugValue,
    useId,
    // useSyncExternalState
} from 'react';

import { useUsers } from './Users.hooks';

// Userコンポーネント
function User({ name }: { name: string }) {
    return <li style={{ padding: '2px' }}>{name}</li>;
}

// ユーザ情報の表示を担当するコンポーネント
function Users() {
    // Custom Hook
    const { inputText, users, setInputText, submit, update } = useUsers(); // APIアクセスする機能を分離

    const userList: JSX.Element[] = users.map((user) => {
        // return <li key={user}>{user}</li>;
        return <User key={user} name={user} />;
    });

    const handleChange: React.ChangeEventHandler<HTMLInputElement>
        = (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputText(e.target.value);
            console.log('handleChange:', e.target.value);
        };

    const handleSubmit: React.FormEventHandler<HTMLFormElement>
        = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            submit(); // 分離した機能をinvoke
        };

    const handleUpdate: React.MouseEventHandler<HTMLButtonElement>
        = (e: React.MouseEvent<HTMLButtonElement>) => {
            update(); // 分離した機能をinvoke
        };


    return (
        <div className="App">
            <header className="App-header">
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>

            <div className="App-body">
                <ul>
                    {userList}
                </ul>
                <form onSubmit={handleSubmit}>
                    <input type="text" /*ref={inputTextRef}*/ value={inputText} onChange={handleChange} />
                    <button type="submit">追加</button>
                    {/* inputTextの確認 */}
                    <div>入力値: {inputText}</div>
                    <button onClick={handleUpdate}>更新</button>
                </form>
            </div>
        </div>
    );
}

export default Users;