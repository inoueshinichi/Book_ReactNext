import React from "react";

class TextForm extends React.Component {
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            value: ""
        };
    }

    render(): React.ReactNode {
        return (
            <div>
                <form onSubmit={e => this.doSubmit(e)}>
                    <input type='text'
                        onChange={e => this.doChange(e)}
                        value={this.state.value}
                    />
                    <input type='submit'/>
                </form>
            </div>
        );
    }

    doChange(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ value: e.target.value });
    }

    doSubmit(e: React.ChangeEvent<HTMLButtonElement>): void {
        e.preventDefault();
        window.alert(this.state.value);
    }
}

export default TextForm;