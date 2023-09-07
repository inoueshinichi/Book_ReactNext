import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// components
import Hello from './components/Hello';
import Parent from './components/ContextProviderConsumer';
import Counter1 from './components/Hook1_useState';
import Counter2 from './components/Hook2_useReducer';
import { ParentOfMemoComp1 } from './components/Hook3_Memo1';
import { ParentOfMemoComp2 } from './components/Hook3_Memo2';
import { ParentOfMemoComp3 } from './components/Hook3_Memo_useCallback';
import { UseMemoSample } from './components/Hook3_Memo_useMemo';
import { Clock } from './components/Hook4_useEffect';
import { UseContextParent } from './components/Hook4_useContext';
import { ImageUploader } from './components/Hook5_useRef';
import { ImperativeParent } from './components/Hook6_useImperativeHandle';
import { Input } from './components/Hook7_customHook';

// official tutorial
import { Game } from './components/TicTacToe';
import { ThinkingInReactApp } from './components/ThinkingInReact';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// root.render()に記述するサンプル群
{/* AppからHelloに置き換える */ }
{/* <App /> */ }
{/* <Hello /> */ }
{/* <Parent /> */ }
{/* <Counter1 initialValue={1} /> */ }
{/* <Counter2 initialValue={2} /> */ }

root.render(
  // <React.StrictMode>
    // <ParentOfMemoComp1 />
    // <ParentOfMemoComp2 />
    // <ParentOfMemoComp3 />
    // <UseMemoSample />
    // <Clock />
    // <UseContextParent />
    // <ImageUploader />
    // <ImperativeParent />
    // <Input />
    // <Game />
  <ThinkingInReactApp />
  // </React.StrictMode>
  // <h1>見出し</h1>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
