// Tic-Tac-Toeサンプル
import React, { useState } from 'react';

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

    // コールバック
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
        onPlay(nextSquares);
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

export const Game = () => {
    // 状態
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 == 0;
    const currentSquares: Squares = history[currentMove]; // 履歴から現在の盤面を取得

    function handlePlay(nextSquares: Squares): void {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory); // 盤面の履歴を更新
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove: number): void {
        setCurrentMove(nextMove); // 再描画を発生させる
    }

    const moves = history.map((squares, move): React.JSX.Element => {
        let description;
        if (move > 0) {
            description = 'Go to move #' + move;
        } else {
            description = 'Go to game start';
        }
        return (
            <li key={move}>
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