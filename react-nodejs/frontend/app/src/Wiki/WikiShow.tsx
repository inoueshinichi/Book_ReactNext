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
    markdown: string;
    html: string;
    loaded: boolean;
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
        this.urlParamsName = props.match.params.name ?? '';

        this.state = {
            name: this.urlParamsName,
            markdown: '',
            html: '',
            loaded: false,
            login: false
        };

        this.serverApiUrl = "http://localhost:3335"
        this.serverStaticUrl = "http://localhost:3000";

        console.log('[DONE] WikiShow constructor');
    }

    // Wikiの内容を読み込む
    componentWillMount(): void {

        // Cookieが存在しない(ログアウト)状態ではfetchしない.
        const userId: string = Cookies.get('UserId') ?? "Unknown";
        if (userId === "Unknown") {
            return;
        }

        const { name: wikiname } = this.state;

        // fetch API
        fetch(`${this.serverApiUrl}/api/get/${wikiname}`, {
            method: 'get',
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, 
            // origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }).then((res: Response) => {
            return res.text(); // markdown
        }).then((data: string) => {

            // markdownの取得
            const mdText: string = data;
            const { name: wikiname } = this.state;

            // markdown -> html
            const htmlText: string = marked.parse(mdText) as string;

            // 再描画
            this.setState({
                name: wikiname,
                markdown: mdText,
                html: htmlText,
                loaded: true
            });

        }).catch((err: Error) => {

        }).finally(() => {
            console.log(`[Done] fetch API for /api/get/${this.state.name}`);
        });

        console.log('[DONE] WikiShow componentWillMount');
    }

    // 仮想DOMのマウント完了(一発目のrenderの後に発生)
    componentDidMount(): void {
        console.log('[DONE] WikiShow componentDidMount');
    }

    // 画面の表示
    render(): React.JSX.Element {

        // 自身のURLがリダイレクトされて結果取得されているのか否かをチェック
        const userId: string = Cookies.get('UserId') ?? "Unknown";
        if (userId === "Unknown") {
            // もしログインしていなければ、リダイレクト
            window.location.replace(`${this.serverApiUrl}/`);
            window.alert(`[Redirect] 外部サイト(${this.serverApiUrl}/)にリダイレクトします.`);
            return <></>;
        }

        if (!this.state.loaded) {
            return <p>読み込み中...</p>;
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