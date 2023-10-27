import React from "react";

class ZipcodeInput extends React.Component {
    state: {};

    constructor(props: Readonly<{}>) {
        super(props);
        const v: string = (this.props.value) ? this.props.value : '';
        // 状態
        this.state = {
            value: v,
            isOK: this.checkValue(v)
        };
    }

    // 郵便番号のパターンマッチング
    checkValue(s: string): boolean {
        const zipPattern: RegExp = /^\d{3}-\d{4}$/;
        return zipPattern.test(s);
    }

    // ユーザーにより値が変更されたときのコールバック
    handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const v: string = e.target.value;
        // 数値とハイフン以外を除外
        const processedValue = v.replace(/[^0-9-]+/g, '');
        const isZipcode: boolean = this.checkValue(processedValue);

        // 状態に設定
        this.setState({
            value: processedValue,
            isOK: isZipcode
        });

        // propsからのコールバックがあれば、イベントを実行
        // なければ無視
        if (this.props.onChange) {
            this.props.onChange({
                target: this,
                value: processedValue,
                isOK: isZipcode
            });
        }

    }

    componentWillReceiveProps(nextProps: Readonly<{}>, nextContext: any): void {
        this.setState({
            value: nextProps.value,
            isOK: this.checkValue(nextProps.value)
        });
    }

    // 描画
    render(): React.ReactNode {
        const msg: string = this.renderStatusMessage();
        return (
            <div>
                <label>郵便番号: <br />
                    <input type='text'
                        placeholder="郵便番号を入力(xxx-xxxx)"
                        value={this.state.value}
                        onChange={e => this.handleChange(e)} 
                    />
                    {msg}
                </label>
            </div>
        );
    }

    // 入力が正しいかどうかのメッセージ
    renderStatusMessage(): React.ReactNode {
        // メッセージ用の基本的なstyle
        const co = {
            margin: '8px',
            padding: '8px',
            color: 'white'
        };

        let msg = null;
        if (this.state.isOK) {
            so.backgroundColor = 'green'; // 追加
            msg = <span style={so}>OK</span>;
        } else {
            if (this.state.value !== '') {
                so.backgroundColor = 'red';
                msg = <span style={so}>NG</span>;
            }
        }

        return msg;
    }
}

export default ZipcodeInput;