import React from "react";

class TextAreaForm extends React.Component {
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            value: 'Hello'
        };
    }

    render(): React.ReactNode {
        // フォームにテキストエリアを指定
        return (
            <div>
                <form onSubmit={e => this.doSubmit(e)}>
                    <textarea onChange={e => this.doChange(e)}
                        value={this.state.value}
                    /><br />
                    <input type='submit' value="決定" />
                </form>
            </div>
        );
    }

    doChange(e) {
        this.setState({
            value: e.target.value
        });
    }

    doSubmit(e) {
        e.preventDefault();
        window.alert(this.state.value);
    }
}

export default TextAreaForm;