import React from "react";

class ValueInput extends React.Component {
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            value: this.props.value
        };
    }

    handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const v: string = e.target.value;
        // 数値以外を除外
        const newValue: string = v.replace(/[^0-9.]+/g, '');
        // 状態に設定
        this.setState({
            value: newValue
        });

        // 上位コンポーネントのイベント(コールバック)を実行
        if (this.props.onChange) {
            // Inch2CmFormクラスのinchChangedコールバック
            this.props.onChange({
                target: this,
                value: newValue
            });
        }
    }

    // プロパティが更新されたとき
    componentWillReceiveProps(nextProps: Readonly<{}>, nextContext: any): void {
        this.setState({
            value: nextProps.value
        });
    }

    render(): React.ReactNode {
        return (
            <div>
                <label>{this.props.title}: <br />
                    <input type='text'
                        value={this.state.value}
                        onChange={e => this.handleChange(e)}
                    />
                </label>
            </div>
        );
    }
}

export default ValueInput;