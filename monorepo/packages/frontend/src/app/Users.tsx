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

// Userコンポーネント
function User({ name }: { name: string }) {
    return <li style={{ padding: '2px' }}>{name}</li>;
}

// ユーザ情報をAPIから取得する関数
const getUsers = async () => {
    // URL
    const url: string = 'http://localhost:3000/api/users';

    // Request Headers
    const reqHeaders = new Headers();
    // reqHeaders.append('Content-Type', "application/json");

    // Request
    const req: Request = new Request(url, {
        method: 'GET',
        headers: reqHeaders,
        mode: 'cors',
        credentials: 'include',
        cache: 'no-store',
        redirect: 'follow',
        // referrer: 'client',
        referrerPolicy: 'origin',
        // body: null,
        keepalive: false,
        // integrity: '',
    });

    const response: Response = await fetch(req);
    const body = response.json();
    return body; // Promise<JSON>
};

// サーバAPIにJSON形式のデータを提出する関数
const setUser = async (id: number, name: string) => {
    // URL
    const url: string = 'http://localhost:3000/api/post';

    // Request Headers
    const reqHeaders = new Headers();
    reqHeaders.append('Content-Type', "application/json");

    // const postData = {
    //     'name': 'inoue shinichi',
    //     'message': 'Hello World'
    // };

    const postData = {
        'id': id,
        'name': name
    };

    // Request
    const req: Request = new Request(url, {
        method: 'POST',
        headers: reqHeaders,
        mode: 'cors',
        credentials: 'include',
        cache: 'no-store',
        redirect: 'follow',
        // referrer: 'client',
        referrerPolicy: 'origin',
        body: JSON.stringify(postData),
        keepalive: false,
        // integrity: '',
    });

    const response: Response = await fetch(req);
    const body = response.json();
    return body; // Promise<JSON>
};


function Users() {
    // const users = ['alpha', 'beta', 'gamma', 'delta'];
    // const [users, setUsers] = useState(['alpha', 'beta', 'gamma', 'delta']);
    const [users, setUsers] = useState<string[]>([]);
    const [counter, setCounter] = useState<number>(0);
    // let inputText: string = '';
    const [inputText, setInputText] = useState<string>('');
    // const inputTextRef = useRef(null);

    // useEffectでマウント後に一度だけ呼び出す
    useEffect/*useLayoutEffect*/(() => {
        // ユーザ情報取得関数を呼び出す
        getUsers()
            .then((data) => {
                console.log(data);
                // 名前だけの配列に変換する
                const users = data.users.map((user: { id: number; name: string }) => user.name);
                return users;
            })
            .then((users: string[]) => {
                setUsers(users);
            })
            .catch((err) => console.error(err))
            .finally(() => console.log('[DONE] getUsers at useEffect'));
    }, [counter]);

    const userList: JSX.Element[] = users.map((user) => {
        // return <li key={user}>{user}</li>;
        return <User key={user} name={user} />;
    });

    const handleSubmit: React.FormEventHandler<HTMLFormElement>
        = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            if (inputText === '') {
                console.log('inputText === ``');

                // ユーザ情報取得関数を呼び出す
                getUsers()
                    .then((data) => {
                        console.log(data);
                        // 名前だけの配列に変換する
                        const users = data.users.map((user: { id: number; name: string }) => user.name);
                        return users;
                    })
                    .then((users: string[]) => {
                        setUsers(users);
                    })
                    .catch((err) => console.error(err))
                    .finally(() => console.log('[DONE] getUsers at handleSubmit'));

                return;
            }

            const newUsers: string[] = [...users, inputText];
            setUsers(newUsers);
            console.log('handle submit:', inputText);

            const nextId: number = newUsers.length;
            const nextName: string = inputText;

            // APIにJSON{ id: number; name: string }をポスト
            setUser(nextId, nextName)
                .then((json) => {
                    console.log('[Response JSON]', json);
                    if (json.status) {
                        console.log(`[DONE] Response json.status: ${json.status} at postJson`);
                        setInputText('');
                        // inputTextRef.current.value = '';
                    }
                })
                .catch((err) => console.error(err))
                .finally(() => console.log('[DONE] postJson'));
        };

    const handleChange: React.ChangeEventHandler<HTMLInputElement>
        = (e: React.ChangeEvent<HTMLInputElement>) => {
            // inputText = e.target.value;
            // console.log('handleChange:', e.target.value);
            setInputText(e.target.value);
            console.log('handleChange:', inputText);
        };

    const handleUpdate: React.MouseEventHandler<HTMLButtonElement>
        = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (inputText !== '') {
                setCounter(counter + 1);
            }
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