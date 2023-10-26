import React from "react";

type NumberFormState = {
    value: string;
};

// 数値のみを入力できるフォーム
class NumberForm extends React.Component {
    state: NumberFormState;

    constructor(props: Readonly<{}>) {
        super(props);

        // 状態
        this.state = {
            value: ''
        };
    }

    doChange(event: React.ChangeEvent<HTMLInputElement>): void {
        // バリデーション付き
        const currentValue: string = event.target.value;
        // 数字以外は削除
        const newValue = currentValue.replace(/[^0-9]/g, '');
        // 更新
        this.setState({ value: newValue });
    }

    doSubmit(event: React.ChangeEvent<HTMLButtonElement>): void {
        window.alert(`値を送信: ${this.state.value}`);
        event.preventDefault();
    }

    render(): React.ReactNode {
        // バインド
        const doSubmit = (e) => this.doSubmit(e);
        const doChange = (e) => this.doChange(e);

        return (
            <form onSubmit={doSubmit}>
                <input type='text'
                    value={this.state.value}
                    onChange={doChange} />
                <input type='submit' value="送信" />
            </form>
        );
    }
}

export default NumberForm;