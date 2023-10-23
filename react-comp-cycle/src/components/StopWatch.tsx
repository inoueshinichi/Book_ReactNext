import React from 'react';

// type StopWatchState = {
//     isLive: boolean;
//     curTime: number;
//     startTime: number;
// };

class StopWatch extends React.Component {
    // プロパティ定義
    timerId: number;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state/*: StopWatchState*/ = {
            isLive: false,
            curTiem: 0,
            startTime: 0
        };

        this.timerId = 0;
    }

    // マウントしたとき
    componentWillMount(): void {
        this.timerId = Number(setInterval(() => {
            this.tick();
        }, 1000));
    }

    // アンマウントした時
    componentWillUnmount(): void {
        clearInterval(this.timerId);
    }

    // タイマー関数
    tick() {
        if (this.state.isLive) {
            const v: number = new Date().getTime();
            this.setState({curTime: v});
        }
    }

    // 開始・停止ボタンを押した時
    clickHandler(event: React.MouseEvent<HTMLButtonElement>): void {
        // 停止する時
        if (this.state.isLive) {
            this.setState({isLive: false});
            return;
        }

        // 開始する時
        const v: number = new Date().getTime();
        this.setState({
            curTime: v,
            startTime: v,
            isLive: true
        });
    }

    // 時刻表示ディスプレイを返す
    getDisp(): React.ReactNode {
        const s: any = this.state;
        const delta: number = s.curTime - s.startTime;
        const t: number = Math.floor(delta / 1000);
        const ss: number = t % 60;
        const m: number = Math.floor(t / 60);
        const mm: number = m % 60;
        const hh: number = Math.floor(mm / 60);

        const z: (num: number) => string = (num) => {
            const s = '00' + String(num);
            return s.substr(s.length - 2 , 2);
        };

        return <span className='disp'>
            {z(hh)}:{z(mm)}:{z(ss)}
        </span>;
    }

    // 描画
    render(): React.ReactNode {
        let label: string = 'START';
        if (this.state.isLive) {
            label = 'STOP';
        }
        const disp = this.getDisp();
        type FClick = (e: React.MouseEvent<HTMLButtonElement>) => void;
        const fclick: FClick = (e) => this.clickHandler(e);

        return (
            <div className="StopWatch">
                <div>{disp}</div>
                <button onClick={fclick}>{label}</button>
            </div>
        );
    }
}

export default StopWatch;