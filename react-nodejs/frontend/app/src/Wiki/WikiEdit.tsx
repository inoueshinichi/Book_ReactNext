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
    doc: string;
    loaded: boolean;
    saved: boolean;
    jump: string;
};

// 編集画面コンポーネント
class WikiEdit extends React.Component<WikiEditProps, WikiEditState> {
    private serverApiUrl: string;
    private serverStaticUrl: string;
    private urlParamsName: string;
    private loaded: boolean;

    constructor(props: Readonly<WikiEditProps>) {
        super(props);

        // react-router-dom v6
        // const urlParams = useParams<{ name: string }>();
        // const paramName: string = urlParams.name ?? "not found `name` param of /edit/:name";

        // react-router-dom v5
        this.urlParamsName = this.props.match.params.name ?? "";
        console.log('WikiEdit [urlParamsName]', this.urlParamsName);

        this.loaded = false;
        if (this.urlParamsName !== "") {
            this.loaded = true;
        }

        this.state = {
            name: this.urlParamsName,
            doc: '',
            loaded: this.loaded,
            saved: false,
            jump: ''
        };

        this.serverApiUrl = "http://localhost:3335";
        this.serverStaticUrl = "http://localhost:3000";
    }

    // Wikiの内容を読み込む
    componentWillMount(): void {

        if (this.urlParamsName === "") {
            console.log("WikiEdit [Return] bacause urlParamsName is empty.");
            return;
        }

        console.log("WikiEdit [Start] これからfetchします.");

        const { name: wikiname } = this.state;
        const url: string = `${this.serverApiUrl}/api/get/${wikiname}`;


        // fetch API
        fetch(url, {
            method: 'GET',
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "include", // include, *same-origin, omit
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "origin", // no-referrer, *no-referrer-when-downgrade, origin, 
            // origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }).then((res: Response) => {

            if (!res.ok) {
                return new Error(`WikiEdit [Res Error] status code: ${res.status}`);
            }

            console.log(`WikiEdit [Res Headers] `, res.headers);
            console.log("WikiEdit [Res Body]", res.body);
            return res.json();

        }).then((data: { status: boolean; name: string; record: { timestamp: string, markdown: string } }) => {
            const { status, name, record } = data;
            const markdown: string = record.markdown;

            if (status) {
                this.setState({
                    name: name,
                    doc: markdown,
                    loaded: true,
                    saved: false,
                });
            }

        }).catch((err: Error) => {
            console.error(err);
        }).finally(() => {
            console.log(`[Done] fetch API for /api/get/${this.state.name}`);
        });
    }

    // 仮想DOMのマウント完了(一発目のrenderの後に発生)
    componentDidMount(): void {
        // frames
        console.log(`[Browser] frames: ${window.frames}`);

        // closed
        console.log(`[Browser] closed: ${window.closed}`);

        // history
        console.log(`[Browser] history: ${window.history}`);

        // location
        console.log(`[Browser] location: ${window.location}`);

        // document
        console.log(`[Browser] document: ${window.document}`);

        // screen
        console.log(`[Browser] screen: ${window.screen}`);

        // statusbar
        console.log(`[Browser] statusbar: ${window.statusbar}`);

        // localStorage
        console.log(`[Browser] localStorage: ${window.localStorage}`);

        // sessionStorage
        console.log(`[Browser] sessionStorage: ${window.sessionStorage}`);

        // navigator
        console.log(`[Browser] navigator: ${window.navigator}`);

        // name
        console.log(`[Browser] name: ${window.name}`);

        console.log('[DONE] WikiEdit componentDidMount');
    }

    // 本文をサーバーにPOSTする
    save(): void {

        const { name: wikiname, doc: wikidoc } = this.state;
        const data: {} = {
            name: wikiname,
            doc: wikidoc,
        };

        console.log("WikiEdit [Start] これからfetchします.");

        let reqHeaders = new Headers();
        reqHeaders.set('Content-Type', 'application/json');
        // reqHeaders.set('Access-Control-Request-Origin', this.serverStaticUrl);

        // fetch API
        const url: string = `${this.serverApiUrl}/api/put/${wikiname}`;
        console.log(`[URL] ${url}`);
        fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *cache-store, no-cache, reload, force-cache, only-if-cached
            credentials: "include", // include, *same-origin, omit
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "origin", // no-referrer, *no-referrer-when-downgrade, origin, 
            // origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            headers: reqHeaders,
            body: JSON.stringify(data)
        }).then((res: Response) => {

            if (!res.ok) {
                return new Error(`WikiEdit [Res Error] status code: ${res.status}`);
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
                saved: status,
                jump: `wiki/${wikiname}`
            });
        })
        .catch((err: Error) => {
            console.error(err);
        }).finally(() => {
            console.log(`[Done] fetch API for /api/put/${wikiname}`);
        });
    }

    // テキストエリアの内容を更新
    bodyChanged(e: React.ChangeEvent<HTMLTextAreaElement>): void {
        this.setState({
            doc: e.target.value
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
        const { saved, jump } = this.state;
        if (saved && jump !== "") {
            window.location.replace(`${this.serverApiUrl}/${this.state.jump}`);
            window.alert(`[Redirect] APIサーバ(${this.serverApiUrl}/${this.state.jump})にリダイレクトします.`);
            return <>リダイレクト中</>;
        }


        // 編集画面を表示
        let readonly: boolean = false;
        let placeholder: string = "";
        if (this.state.loaded) {
            readonly = true;
            placeholder = this.state.name;
        }
        console.log('readonly', readonly);
        console.log('placeholder ', placeholder);

        return (
            <div>
                <h1>
                    <p>WikiName</p>
                    <input type="text"
                        placeholder={placeholder}
                        readOnly={readonly}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.changeWikiname(e)} />
                </h1>
                <textarea rows={12} cols={60}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => this.bodyChanged(e)}
                    value={this.state.doc} />
                <br />
                <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => this.save()}>保存</button>
            </div>
        );


    }
}

export default WikiEdit;