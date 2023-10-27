import React from "react";

class CBoxForm extends React.Component {
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            check: true
        };
    }

    render(): React.ReactNode {
        return (
            <div>
                <form onSubmit={e => this.doSubmit(e)}>
                    <label>
                        <input type='checkbox' 
                            onChange={e => this.doChange(e)}
                            checked={this.state.check}
                        />食べる
                    </label>
                    <br />
                    <input type='submit' value='決定' />
                </form>
            </div>
        );
    }

    doChange(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({ check: !this.state.check });
    } 

    doSubmit(e: React.ChangeEvent<HTMLButtonElement>): void {
        e.preventDefault();
        window.alert(this.state.check ? '食べる' : '食べない');
    }
}

export default CBoxForm;