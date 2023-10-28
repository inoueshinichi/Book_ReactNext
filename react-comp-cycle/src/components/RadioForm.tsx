import React from "react";

class RadioForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: props.items,
            value: ''
        };
    }

    render() {
        // ラジオの選択肢を生成
        const radioList = this.state.items.map(i => {
            return (
                <div key={i}>
                    <label>
                        <input type='radio'
                            name='items'
                            value={i}
                            checked={this.state.value === i}
                            onChange={e => this.doChange(e)} />
                        {i}
                    </label>
                </div>
            );
        });

        // フォームにラジオボタン一覧を指定
        return (
            <div>
                <form onSubmit={e => this.doSubmit(e)}>
                    {radioList}
                    <input type="submit" />
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

export default RadioForm;