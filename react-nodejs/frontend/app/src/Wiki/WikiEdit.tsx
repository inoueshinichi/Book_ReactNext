import React from "react";
import ReactDom from "react-dom/client";
import { 
    Redirect,
    Link,
} from "react-router-dom";

import "./WikiEdit.css";

type WikiEditProps = {

};

type WikiEditState = {
    name: string;
    body: string;
    loaded: boolean;
    jump: string;
};

// 編集画面コンポーネント
class WikiEdit extends React.Component<WikiEditProps, WikiEditState> {
    constructor(props: Readonly<WikiEditProps>) {
        super(props);

        const { params } = props.match;
        const name: string = params.name;

        this.state = {
            name: name,
            body: '',
            loaded: false,
            jump: ''
        };
    }

    // Wikiの内容を読み込む
    componentWillMount(): void {
        // fetch API
        fetch(`/api/get/${this.state.name}`, {
            method: 'GET',
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, 
            // origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }).then((res: Response) => {

        }).catch((err: Error) => {

        }).finally(() => {
            console.log(`[Done] fetch API for /api/get/${this.state.name}`);
        });
    }

    // 本文をサーバーにPOSTする
    save(): void {
        const wikiname: string = this.state.name;
        // fetch API
        fetch(`/api/put/${this.state.name}`, {
            method: 'POST',
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, 
            // origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: {
                name: wikiname,
                doc: this.state.body
            }
        }).then((res: Response) => {

        }).catch((err: Error) => {

        }).finally(() => {
            console.log(`[Done] fetch API for /api/get/${this.state.name}`);
        });
    }

    // UI更新
    bodyChanged(e: React.ChangeEvent</*<textarea>*/HTMLTextAreaElement>): void {
        this.setState({
            body: e.target.value
        });
    }

    // 編集画面を表示
    render(): React.JSX.Element {
        if (!this.state.loaded) {
            return (<p>読み込み中</p>);
        }
        if (this.state.jump !== '') {
            // メイン画面にリダイレクト
            return <Redirect to={this.state.jump} />
        }

        const name: string = this.state.name;
        return (
            <div>
                <h1><Link to={`/wiki/${name}`}>{name}</Link></h1>
                <textarea rows={12} cols={60} 
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => this.bodyChanged(e) }
                    value={this.state.body} />
                <br />
                <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => this.save() }>保存</button>
            </div>
        );
    }
}