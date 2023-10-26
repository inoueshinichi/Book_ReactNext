import React from "react";
import ValueInput from "./ValueInput";

type Inch2CmFormState = {
    inch: number;
    cm: number;
};

class Inch2CmForm extends React.Component {
    state: Inch2CmFormState;

    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            inch: 0,
            cm: 0
        };
    }

    // インチが更新されたときのコールバック
    inchChanged(childProps: Readonly<{target: any, value: number}>): void {
        const inchValue: number = childProps.value;
        const cmValue: number = inchValue * 2.54;
        this.setState({
            inch: inchValue,
            cm: cmValue
        });
    }

    // センチが更新されたときのコールバック
    cmChanged(childProps: Readonly<{target: any, value: number}>): void {
        const cmValue: number = childProps.value;
        const inchValue: number = cmValue / 2.54;
        this.setState({
            inch: inchValue,
            cm: cmValue
        });
    }

    render(): React.ReactNode {
        return (
            <div>
                <ValueInput title='inch'
                    onChange={e => this.inchChanged(e)}
                    value={this.state.inch}
                />
                <ValueInput title='cm'
                    onChange={e => this.cmChanged(e)}
                    value={this.state.cm}
                />
            </div>
        )
    }
}

export default Inch2CmForm;