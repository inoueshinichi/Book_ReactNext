import React from 'react';

class Cycle extends React.Component {
    // マウント
    constructor(props: Readonly<{}>) {
        super(props);
        console.log("constructor");
    }

    componentWillMount(): void {
        console.log('componentWillMount');
    }

    componentDidMount(): void {
        console.log("componentDidMount");
    }

    // 更新
    componentWillReceiveProps(nextProps: Readonly<{}>, nextContext: any): void {
        console.log('componentWillReceiveProps');
    }

    shouldComponentUpdate(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): boolean {
        console.log('shouldComponentUpdate');
        return true;
    }

    componentWillUpdate(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): void {
        console.log('componentWillUpdate');
    }

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any): void {
        console.log('componentDidUpdate');
    }

    // アンマウント
    componentWillUnmount(): void {
        console.log('componentWillUnmount');
    }

    // 描画
    render(): React.ReactNode {
        console.log('render');
        type SetStateHandle = (event: React.MouseEvent<HTMLButtonElement>) => void;
        const setStateHandler: SetStateHandle = (event) => {
            event.preventDefault();
            console.log('* call setState()');
            this.setState({ r: Math.random() });
        }

        return (
            <div>
                <button onClick={setStateHandler}>setState</button>
            </div>
        )
    }
}

export default Cycle;