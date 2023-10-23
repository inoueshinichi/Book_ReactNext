import React from 'react';
import { useState, useMemo, memo, useCallback } from 'react';

// lazyと動的importによる遅延読み込み
// 遅延読み込みするコンポーネントはデフォルトエクスポートする必要があるので注意.
import { Suspense, lazy } from "react";
const AddButton = lazy(() => import('./lazy_import_components/AddButton'));

const ItemCart = () => {
    console.log('render <ItemCart />');

    const [item, setItem] = useState('');
    const [cartItems, setCartItems] = useState([]);

    // コールバックをメモ化
    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setItem(event.target.value);
    }, []);

    // コールバックをメモ化
    const handleAdd = useCallback(() => {
        if (cartItems.includes(item)) {
            return;
        }

        setCartItems((items) => [...items, item]);
        setItem('');
    }, [cartItems, item]);

    const myStyle = {
        margin: "10px"
    };


    // コールバックをメモ化
    const handleClear = useCallback(() => {
        setCartItems([]);
    }, []);

    return (
        
        <div style={myStyle}>
            <h1>商品を購入</h1>
            <Input value={item} onChange={handleChange} />
            
            {/* 遅延読み込みをするコンポーネントはSuspenseで括る */}
            <Suspense fallback={<div>Loading...</div>}>
                <AddButton disabled={item.trim() === ''} onClick={handleAdd} />
            </Suspense>

            <ClearButton onClick={handleClear} />
            <Total cartItems={cartItems} />
            <ul>
                {cartItems.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

const Input = (props: { value: string, onChange: () => void }) => {
    console.log('render <Input />');
    const {value, onChange} = props;

    return (
        <p>
            <label>
                アイテム名: <input type='text' value={value} onChange={onChange} />
            </label>
        </p>
    );
};

// const AddButton = ({ disabled, onClick }) => {
//     console.log('render <AddButton />');

//     return (
//         <p>
//             <button disabled={disabled} onClick={onClick}>
//                 カートに追加する
//             </button>
//         </p>
//     );
// };

const Total = memo((props: { cartItems: string[] }) => {
    console.log('render <Total />');

    const cartItems = props.cartItems;

    const total = useMemo(() => {

        return cartItems.reduce((accumulate, current) => {
            const t: number = Date.now();

            // 遅延処理
            while (Date.now() - t < 100) {
                // 擬似的に100msの遅延を発生させる
            }

            return current.length * 100 + accumulate;
        }, 0);

    }, [cartItems]);
    
    return <p>合計: {total}円</p>;
});

const ClearButton = memo(({ onClick }) => {
    console.log("render <ClearButton />");

    return (
        <p>
            <button onClick={onClick}>カートを空にする</button>
        </p>
    );
});

export default ItemCart;