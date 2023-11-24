import React from "react";
import ReactDOM from "react-dom";
import "./RealTimeChatApp.css";
import RealTimeChatForm from "./RealTimeChatForm";
import { socket,  origin } from "./RealTimeSocket";


type RealTimeChatComment = {
    name: string;
    message: string;
};

type RealTimeChatAppState = {
    items: Array<{ key: string; comment: RealTimeChatComment }>
};

type RealTimeChatAppProps = {}

// アプリケーション
class RealTimeChatApp extends React.Component<RealTimeChatAppProps, RealTimeChatAppState> {
    
    constructor(props: Readonly<RealTimeChatAppProps>) {
        super(props);

        this.state = {
            items: []
        };
    }

    // コンポーネントがマウントされたとき
    componentDidMount(): void {

        // サーバ側に接続されてた時に呼ばれる
        socket.on('connect', () => {
            console.log('[Connected] to', origin);
        });

        // リアルタイムにログを受信するように設定(Stream)
        socket.on('fromAPI', (record: RealTimeChatComment) => {
            const key: string = 'key_' + String(this.state.items.length + 1);
            const comment: RealTimeChatComment = {
                name: record.name,
                message: record.message
            };

            // 再描画
            this.setState({
                items: [...this.state.items, { key: key, comment }]
            });
        });
    }

    componentWillUnmount(): void {
        // サーバ側に明示的にsocket通信の遮断を伝える.
        // Disconnects the socket manually. In that case, the socket will not try to reconnect.
        // socket.disconnect(); // これ入れるとemitされない
    }

    render(): JSX.Element {

        // ログを1つずつ描画内容を生成
        const messages: JSX.Element[] = this.state.items.map(
            (e: { key: string; comment: RealTimeChatComment }): JSX.Element => {
            return (
                <div key={e.key}>
                    <span>{e.comment.name}</span>
                    <span>: {e.comment.message}</span>
                    <p style={{clear: 'both'}} />
                </div>
            );
        });

        return (
            <div>
                <h1>リアルタイムチャット</h1>
                <RealTimeChatForm />
                <div>{messages}</div>
            </div>
        );
    }
}

export default RealTimeChatApp;

