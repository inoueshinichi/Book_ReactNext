// Tic-Tac-Toeサンプル
import React, { useState } from 'react';


export const Game = () => {

    // 状態
    const [history, setHistory/*再描画発生*/] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove/*再描画発生*/] = useState(0);
    const xIsNext = currentMove % 2 == 0; // currentMoveの偶数・奇数でxIsNext===true or falseがわかる.
    const currentSquares: Squares = history[currentMove]; // 履歴から現在の盤面を取得[[null,...,null], [null,...,null], [null,...,null]]

    // Boardコンポーネントで呼び出すコールバック
    function handlePlay(nextSquares: Squares): void {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory); // 盤面の履歴を更新(再描画発生)
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove: number): void {
        setCurrentMove(nextMove); // 再描画発生
    }

    // 盤面の状態表示
    const moves = history.map((squares, move/*index*/): React.JSX.Element => {
        let description;
        if (move > 0) {
            description = 'Go to move #' + move;
        } else {
            description = 'Go to game start';
        }
        return (
            // Reactは, 前回の状態キーを覚えておいて, 新規キーが発生した場合、自動でタグ追加する. 
            // keyに配列のインデックスを指定するのはおすすめしないが、この場合、インデックスの順序が変わることが無いのでOK
            <li key={move}/* 識別子をつける. keyは特別な識別子@React */>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

type SquareInput = {
    value: string;
    onSquareClick: (() => void);
};

function Square(props: SquareInput): React.JSX.Element {
    const {value, onSquareClick} = props;
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}

type Squares = Array<string>;

type BoardInput = {
    xIsNext: boolean;
    squares: Squares;
    onPlay: ((nextSquares: Squares) => void);
};


function Board(props: BoardInput): React.JSX.Element {
    const { xIsNext, squares, onPlay } = props;

    // Squareコンポーネントで呼び出すコールバック
    function handleClick(i: number) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        onPlay(nextSquares); // Gameコンポーネント側から転送されてきたコールバック関数 -> 状態をGameに送る
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    return (
        <>
            <div className="status">{status}</div>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
                <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
                <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
                <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
                <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
                <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
                <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>
        </>
    );
}

// 勝者を決める関数
function calculateWinner(squares: Squares) {
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}