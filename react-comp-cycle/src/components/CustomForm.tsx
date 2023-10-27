import React from "react";
import FormInput from "./FormInput";

class CustomForm extends React.Component {
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            email: "",
            tel: "",
            url: "",
            allok: false
        };
        this.oks = {};
    }

    handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        // すべての項目がOKになったか
        this.oks[e.name] = e.isOK;
        this.setState({
            [e.name]: e.value,
            allok: (this.oks['email'] && this.oks['tel'])
        });
    }

    handleSubmit(e: React.ChangeEvent<HTMLButtonElement>): void {
        window.alert(JSON.stringify(this.state));
        e.preventDefault();
    }

    render(): React.ReactNode {
        const doChange = e => this.handleChange(e);
        const doSubmit = e => this.handleSubmit(e);

        // Eメールを表すパターン
        const emailPattern: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        // URLパターン
        const urlPattern: RegExp = /^https?(:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+)$/;

        // ASCII文字以外全部
        const asciiFilter: RegExp = /[^\u0020-\u007e]+/g;

        return (
            <form onSubmit={doSubmit}>
                <FormInput name='email' label='メール'
                    value={this.state.email}
                    filter={asciiFilter}
                    pattern={emailPattern}
                    onChange={doChange}
                />
                <FormInput name='tel' label='電話番号'
                    value={this.state.tel}
                    filter={/[^0-9-()+]/g}
                    pattern={/^[0-9-()+]+$/}
                    onChange={doChange}
                />
                <FormInput name='url' label='URL'
                    value={this.state.url}
                    filter={asciiFilter}
                    pattern={urlPattern}
                    onChange={doChange}
                />
                <input type='submit' value='送信' disabled={!this.state.allok} />
            </form>
            // <label>テスト</label>
        );
    }
}

export default CustomForm;