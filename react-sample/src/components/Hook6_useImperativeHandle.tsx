// 親コンポーネントで管理するrefインスタンスを子コンポーネントで操作する 
// useImperativeHandle
// React.forwardRef
import React, { useState, useRef, useImperativeHandle } from 'react';

// 子コンポーネント
const Child = React.forwardRef((props, /*refインスタンスを子に渡す*/ref) => {
    const [message, setMessage] = useState<string | null>(null);

    // useImperativeHandleで親コンポーネントのrefから参照できる値を指定
    useImperativeHandle(ref, () => (/*一行で書くために{}でくくる. 結果, アロー演算子=>が使える. */{
        showMessage: () => {
            const date = new Date();
            const message = `Hello, it's ${date.toLocaleString()} now`;
            setMessage(message);
        },
    }));

    return <div>{message != null ? <p>{message}</p> : null}</div>
});

// 親コンポーネント
export const ImperativeParent = () => {
    const childRef = useRef</*object*/{ showMessage: () => void }>(null);
    const onClick = () => {
        if (childRef.current !== null) {
            // 子コンポーネントのuseImperativeHandleで指定した値を参照
            childRef.current.showMessage();
        }
    };

    return (
        <div>
            <button onClick={onClick}>Show Message</button>
            <Child ref={childRef} />
        </div>
    )
}