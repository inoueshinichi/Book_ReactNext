import React from "react";

type MultiFormState = {
    name: string;
    age: number;
    hobby: string;
};

class MultiForm extends React.Component {
    state: MultiFormState;

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            name: "井上真一",
            age: 33,
            hobby: "キャンプ"
        };
    }

    doChange(e: React.ChangeEvent<HTMLInputElement>) {
        const userValue = e.target.value;
        const key = e.target.name;
        this.setState({[key]: userValue});
    }

    doSubmit(e: React.ChangeEvent<HTMLButtonElement>) {
        e.preventDefault();
        const j: string = JSON.stringify(this.state);
        window.alert(j);
    }

    render(): React.ReactNode {
        return (
            <form onSubmit={(e) => this.doSubmit(e)}>
                <div>
                    <label>
                        名前: <br />
                        <input name='name' 
                            type='text' 
                            value={this.state.name}
                            onChange={(e) => this.doChange(e)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        年齢: <br />
                        <input name='age'
                            type='text'
                            value={this.state.age}
                            onChange={(e) => this.doChange(e)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        趣味: <br />
                        <input name='hobby'
                            type='text'
                            value={this.state.hobby}
                            onChange={(e) => this.doChange(e)}
                        />
                    </label>
                </div>
                <input type='submit' value='送信' />
            </form>
        )
    }
}

export default MultiForm;