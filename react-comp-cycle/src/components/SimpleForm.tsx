import React from "react";

// フォームコンポーネント
class SimpleForm extends React.Component {
    
    constructor(props: Readonly<{}>) {
        super(props);
        // 状態を初期化
        this.state = {
            value: ''
        };
    }

    // 値が変更された時のコールバック
    doChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newValue = event.target.value;
        this.setState({
            value: newValue
        });
    }

    // 送信ボタンが押された時のコールバック
    doSubmit(event: React.ChangeEvent<HTMLButtonElement>): void {
        window.alert(`値を送信: ${this.state.value}`);
        event.preventDefault();
    }

    // 画面の描画
    render(): React.ReactNode {
        return (
            <form onSubmit={(event: React.ChangeEvent<HTMLButtonElement>) => this.doSubmit(event)}>
                <input type='text' 
                        value={this.state.value} 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.doChange(event)}
                />
                <input type='submit' value='送信' />
            </form>
        );
    }
}

export default SimpleForm;