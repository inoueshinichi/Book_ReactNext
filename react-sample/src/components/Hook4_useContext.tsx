// Contextから値を参照するためのフック useContext
// ContextのProvider/Comsumerの代替手法

import React, { useContext } from 'react';

type User = {
    id: number;
    name: string;
};

// ユーザーデータを保持するContextを作成する. (定義したコンポーネントの子コンポーネント間で共有できる状態)
const UserContext = React.createContext<User | null>(null);

const GrandChild = () => {
    // useContextにContextを渡すことで, Contextから値を取得する.
    const user = useContext(UserContext); // UseContext.Consumerの代替手法.

    return user !== null ? <p>Hello, {user.name}</p> : null;
}

const Child = () => {
    const now = new Date();

    return (
        <div>
            <p>Current: {now.toLocaleString()}</p>
            <GrandChild />
        </div>
    )
}

export const UseContextParent = () => {
    const user: User = {
        id: 1,
        name: 'Alice',
    };

    return (
        // Contextに値を渡す
        <UserContext.Provider value={user}>
            <Child />
        </UserContext.Provider>
    )
}