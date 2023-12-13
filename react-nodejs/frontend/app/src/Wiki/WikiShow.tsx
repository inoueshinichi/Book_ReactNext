import React from "react";
import ReactDom from "react-dom/client";
import {
    Link
} from "react-router-dom";

// mardwond -> html
import { marked } from 'marked';
// html -> JSX Element
import parse from 'html-react-parser';

import "./WikiShow.css";

// cookie
import Cookies from "js-cookie";

// ReactRouterのPropsのMatchを取得する
// react-router-dom v5 
// https://qiita.com/nakamo-03/items/0d76a016c445868c5b09
import { RouteComponentProps } from 'react-router-dom';
// react-router-dom v6 
// import { useParams } from 'react-router-dom'

interface WikiShowProps extends RouteComponentProps<{ name: string }> {

};

type WikiShowState = {
    name: string;
    html: string;
    login: boolean;
};

// Wikiメイン画面表示コンポーネント
class WikiShow extends React.Component<WikiShowProps, WikiShowState> {
    private serverApiUrl: string;
    private serverStaticUrl: string;
    private urlParamsName: string;

    constructor(props: Readonly<WikiShowProps>) {
        super(props);

        // react-router-dom v6
        // const urlParams = useParams<{ name: string }>();
        // const paramName: string = urlParams.name ?? "not found `name` param of /wiki/:name";

        // react-router-dom v5
        this.urlParamsName = this.props.match.params.name ?? "";
        console.log(`WikiShow [urpParamsName] `, this.urlParamsName);

        // Cookieでログイン状態を確認
        const userId: string = Cookies.get('UserId') ?? "Unknown";
        let login: boolean = false;
        if (userId !== "Unknown") {
            login = true;
        }

        this.state = {
            name: this.urlParamsName,
            html: '',
            login: login
        };

        this.serverApiUrl = "http://localhost:3335"
        this.serverStaticUrl = "http://localhost:3000";

        console.log('[DONE] WikiShow constructor');
    }

    // Wikiの内容を読み込む
    componentWillMount(): void {

        // Cookieが存在しない(ログアウト)状態ではfetchしない.
        const userId: string = Cookies.get('UserId') ?? "Unknown";
        console.log(`[UserId] ${userId}`);
        if (userId === "Unknown") {
            console.log("WikiShow [Return] bacause UserId is `Unkonwn`.");
            return;
        }

        console.log("WikiShow [Start] これからfetchします.");

        const { name: wikiname } = this.state;
        const url: string = `${this.serverApiUrl}/api/get/${wikiname}`;

        let reqHeaders = new Headers();
        reqHeaders.set('Content-Type', 'application/json');
        reqHeaders.set('Access-Control-Request-Origin', this.serverStaticUrl);

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
                return new Error(`WikiShow [Res Error] status code: ${res.status}`);
            }

            console.log(`WikiShow [Res Headers] `, res.headers);
            console.log("WikiShow [Res Body]", res.body);
            return res.json();

        }).then((data: { status: boolean; name: string; record: { timestamp: string, markdown: string}}) => {

            const { status, record } = data;

            let mdText: string = "";
            let timeStamp: string = "";
            if (!status) {
                mdText = `Failed to get Redis DB record from ${url}`;
            }

            // timestampの取得
            timeStamp = record.timestamp;

            // markdownの取得
            mdText = record["markdown"];

            // markdown -> html
            const htmlText: string = marked.parse(mdText) as string;

            // 再描画
            this.setState({
                name: wikiname,
                html: htmlText,
                login: true               
            });

        }).catch((err: Error) => {
            console.error(err);
        }).finally(() => {
            console.log(`[Done] fetch API for /api/get/${wikiname}`);
        });

        console.log('[DONE] WikiShow componentWillMount');
    }

    // 仮想DOMのマウント完了(一発目のrenderの後に発生)
    componentDidMount(): void {
        console.log('[DONE] WikiShow componentDidMount');
    }

    // 画面の表示
    render(): React.JSX.Element {
        console.log(`[DONE] WikiShow render`);

        // 自身のURLがリダイレクトされて結果取得されているのか否かをチェック
        if (!this.state.login || this.urlParamsName === "") {

            // もしログインしていなければ、リダイレクト
            console.log("[State] Logout");
            console.log("[Try] Login by redirect");
            
            window.location.replace(`${this.serverApiUrl}/`);
            window.alert(`[Redirect] 外部サイト(${this.serverApiUrl}/)にリダイレクトします.`);
            return <></>;
        }
        
        const { name: wikiname, html } = this.state;
        
        // html -> JSX.Element
        const jsxElements: string | JSX.Element | JSX.Element[] = parse(html);

        return (
            <div>
                <h1>{wikiname}</h1>
                <div>{jsxElements}</div>
                <p><Link to={`/edit/${wikiname}`}>このページを編集</Link></p>
            </div>
        );
    }
}

export default WikiShow;