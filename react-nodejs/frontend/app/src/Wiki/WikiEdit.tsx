import React from "react";
import ReactDom from "react-dom/client";
import { 
    // Redirect, // v6.x.x以上で非推奨
    // redirect,
    Link,
} from "react-router-dom";

import "./WikiEdit.css";

// cookie
import Cookies from "js-cookie";

// ReactRouterのPropsのMatchを取得する
// react-router-dom v5 
// https://qiita.com/nakamo-03/items/0d76a016c445868c5b09
import { RouteComponentProps } from 'react-router-dom';
// react-router-dom v6 
// import { useParams } from 'react-router-dom'

interface WikiEditProps extends RouteComponentProps<{ name: string }> {

};

type WikiEditState = {
    name: string;
    body: string;
    loaded: boolean;
    jump: string;
};

// 編集画面コンポーネント
class WikiEdit extends React.Component<WikiEditProps, WikiEditState> {
    private serverApiUrl: string;
    private serverStaticUrl: string;

    constructor(props: Readonly<WikiEditProps>) {
        super(props);

        // react-router-dom v6
        // const urlParams = useParams<{ name: string }>();
        // const paramName: string = urlParams.name ?? "not found `name` param of /edit/:name";

        // react-router-dom v5
        const urlParams: string = props.match.params.name ?? '';

        this.state = {
            name: urlParams,
            body: '',
            loaded: false,
            jump: ''
        };

        this.serverApiUrl = "http://localhost:3335";
        this.serverStaticUrl = "http://localhost:3000";
    }

    // Wikiの内容を読み込む
    componentWillMount(): void {

        // // fetch API
        // fetch(`${this.serverApiUrl}/api/get/${this.state.name}`, {
        //     method: 'get',
        //     mode: "cors", // no-cors, *cors, same-origin
        //     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        //     credentials: "same-origin", // include, *same-origin, omit
        //     redirect: "follow", // manual, *follow, error
        //     referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, 
        //     // origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        // }).then((res: Response) => {

        // }).catch((err: Error) => {

        // }).finally(() => {
        //     console.log(`[Done] fetch API for /api/get/${this.state.name}`);
        // });
    }

    // 仮想DOMのマウント完了(一発目のrenderの後に発生)
    componentDidMount(): void {
        // frames
        console.log(`[Browder] frames: ${window.frames}`);
        // closed
        console.log(`[Browder] closed: ${window.closed}`);
        // defaultStatus
        // console.log(`[Browder] defaultStatus: ${window.defaultStatus}`);
        // history
        console.log(`[Browder] history: ${window.history}`);
        
        console.log('[DONE] WikiEdit componentDidMount');
    }

    // 本文をサーバーにPOSTする
    save(): void {
        
        const { name: wikiname, body: wikibody } = this.state;
        const data: {} = {
            name: wikiname,
            doc: wikibody,
        };

        console.log("[Start] これからfetchします.");

        // fetch API
        const url: string = `${this.serverApiUrl}/api/put/${wikiname}`;
        console.log(`[URL] ${url}`);
        fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, 
            // origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then((res: Response) => {

            if (!res.ok) {
                return new Error(`[Error] failed to request with POST to ${url}`);
            }

            return res.json(); // jsonオブジェクト

        }).then((data: any) => {
            const status: boolean = data['status'];
            const msg: string = data['msg'];

            if (status == null) {
                return new Error(`[Error] failed to get status. Given is ${status}`);
            }

            console.log(`[Json] status: ${status}`);
            console.log(`[Json] msg: ${msg}`);

            this.setState({
                loaded: status,
                jump: `wiki/${wikiname}`
            });
        })
        .catch((err: Error) => {
            console.error(`[Error] ${err}`);
        }).finally(() => {
            console.log(`[Done] fetch API for /api/put/${wikiname}`);
        });
    }

    // テキストエリアの内容を更新
    bodyChanged(e: React.ChangeEvent<HTMLTextAreaElement>): void {
        this.setState({
            body: e.target.value
        });
    }

    // Wikinameの内容を更新
    changeWikiname(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            name: e.target.value
        });
    }

    // 画面を表示
    render(): React.JSX.Element {

        // 編集が完了した場合(saveの後)は, リダイレクト
        if (this.state.jump !== "") {
            window.location.replace(`${this.serverApiUrl}/${this.state.jump}`);
            window.alert(`[Redirect] APIサーバ(${this.serverApiUrl}/${this.state.jump})にリダイレクトします.`);
            return <>リダイレクト中</>;
        }

        // 編集画面を表示
        const { name: wikiname } = this.state;
        return (
            <div>
                {/* <h1><a href={`${this.serverApiUrl}/wiki/${wikiname}`}>{wikiname}</a></h1> */}
                <h1><p>WikiName</p><input type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.changeWikiname(e)}/></h1>
                <textarea rows={12} cols={60} 
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => this.bodyChanged(e) }
                    value={this.state.body} />
                <br />
                <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => this.save() }>保存</button>
            </div>
        );
    }
}

export default WikiEdit;