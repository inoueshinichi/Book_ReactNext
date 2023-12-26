// React Hook 機能を分離
import {
    useState,
    useEffect
} from 'react';

// ユーザ情報をAPIから取得する関数
export const getUsers = async () => {
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
export const setUser = async (id: number, name: string) => {
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

// ユーザ情報をAPI経由で取得や変更を担当するCustom Hook
export function useUsers() {
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


    const submit = () => {
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


    const update = () => {
        if (inputText !== '') {
            setCounter(counter + 1);
        }
    }

    return {
        inputText,
        users,
        setInputText,
        submit,
        update
    };
};