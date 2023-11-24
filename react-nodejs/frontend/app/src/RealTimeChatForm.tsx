import React from "react";
import ReactDOM from "react-dom";
import "./RealTimeChatForm.css";

import { socket, origin } from "./RealTimeSocket";

type ChatFormState = {
    name: string;
    message: string;
};

type ChatFormProps = {};

// 書き込みフォーム
class RealTimeChatForm extends React.Component<ChatFormProps, ChatFormState> {

    constructor(props: Readonly<ChatFormProps>) {
        super(props);

        this.state = {
            name: '',
            message: ''
        };
    }

    nameChanged(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            name: e.target.value
        });
    }

    messageChanged(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            message: e.target.value
        });
    }

    // サーバに名前とメッセージを送信
    send(): void {
        socket.emit('toAPI', {
            name: this.state.name,
            message: this.state.message
        });
        console.log(`[toAPI] メッセージを送信 -> name:${this.state.name}, message:${this.state.message}`);

        // 再描画
        this.setState({
            message: '' // 投稿内容をクリア
        });
    }

    render(): JSX.Element {
        return (
            <div>
                名前:<br />
                <input value={this.state.name} onChange={e => this.nameChanged(e)} />
                <br />
                メッセージ:<br />
                <input value={this.state.message} onChange={e => this.messageChanged(e)} />
                <button onClick={e => this.send()}>送信</button>
            </div>
        );
    }
}

export default RealTimeChatForm;