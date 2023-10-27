import React from 'react';

// PropsTypes型を使うための宣言
import PropType from 'prop-types';

class FormInput extends React.Component {
    constructor(props: Readonly<{}>) {
        super(props);
        const v: string = this.props.value;
        this.state = {
            value: v,
            isOK: this.checkValue(v)
        };
    }

    // パターン検証
    checkValue(s: string): boolean {
        if (this.props.pattern === null) {
            return true;
        }

        return this.props.pattern.test(s);
    }

    // コールバック
    handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const v: string = e.target.value;

        // フィルタが指定されていれば、適用
        const filter: RegExp = this.props.filter;
        let newValue:string = v;
        if (filter !== null) {
            newValue = newValue.replace(filter, '');
        }

        const newIsOK: boolean = this.checkValue(newValue);
        this.setState({
            value: newValue,
            isOK: newIsOK
        });

        // イベントを実行(あれば)
        if (this.props.onChange) {
            this.props.onChange({
                target: this,
                value: newValue,
                isOK: newIsOK,
                name: this.props.name
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
        const msg: React.ReactNode = this.renderStatusMessage();
        return (
            <div>
                <label>
                    {this.props.label}: <br />
                    <input type='text'
                        name={this.props.name}
                        placeholder={this.props.placeholder}
                        value={this.props.value}
                        onChange={e => this.handleChange(e)}
                    />
                    {msg}
                </label>
            </div>
        );
    }

    renderStatusMessage(): React.ReactNode {
        const so = {
            margin: '8px',
            padding: '8px',
            color: 'white'
        };

        let msg = null;
        if (this.state.isOK) {
            // OKのとき
            so.backgroundColor = 'green';
            msg = <span style={so}>OK</span>;
        } else {
            // NGのとき　
            if (this.state.value !== '') {
                so.backgroundColor = 'red';
                msg = <span style={so}>NG</span>;
            }
        }
        return msg;
    }
}

export default FormInput;

// 下記を定義するとUIがブラウザに反映されない

// // プロパティの型を定義
// FormInput.propTypes = {
//     value: PropTypes.string, // 文字列型
//     name: PropTypes.string.isRequired, // 文字列型で指定が必須
//     label: PropTypes.string.isRequired,
//     pattern: PropTypes.object,
//     filter: PropTypes.object, // オブジェクト型
//     placeholder: PropTypes.string,
//     onChange: PropTypes.func // 関数型
// };

// // プロパティの初期値を定義
// FormInput.defaultProps = {
//     filter: null,
//     pattern: null,
//     value: '',
//     placeholder: '',
//     onChange: null
// };

