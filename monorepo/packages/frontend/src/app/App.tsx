// Scaffold of App
import { useState } from "react";

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

const postJson = async () => {
    // URL
    const url: string = 'http://localhost:3000/api/post';

    // Request Headers
    const reqHeaders = new Headers();
    reqHeaders.append('Content-Type', "application/json");

    const postData = {
        'name': 'inoue shinichi',
        'message': 'Hello World'
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

function User({ name }: { name: string }) {
    return <li style={ { padding: '8px' } }>{name}</li>;
}

function App() {
    // const users = ['alpha', 'beta', 'gamma', 'delta'];
    const [users, setUsers] = useState(['alpha', 'beta', 'gamma', 'delta']);

    // ユーザ情報取得関数を呼び出す
    getUsers()
        .then((data) => console.log(data))
        .catch((err) => console.error(err))
        .finally(() => console.log('[DONE] getUsers'));

    // let inputText: string = '';
    const [inputText, setInputText] = useState('');

    const userList: JSX.Element[] = users.map((user) => {
        // return <li key={user}>{user}</li>;
        return <User key={user} name={user} />;
    });

    const handleSubmit: React.FormEventHandler<HTMLFormElement> 
    = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newUsers = [...users, inputText];
        setUsers(newUsers);
        console.log('handle submit:', inputText);

        postJson()
            .then((data) => console.log(data))
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
                    <input type="text" onChange={handleChange}/>
                    <button type="submit">追加</button>
                    {/* inputTextの確認 */}
                    <div>入力値: {inputText}</div>
                </form>
            </div>
        </div>
    );
}

export default App;