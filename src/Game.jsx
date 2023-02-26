import {useState} from 'react';

function Square({value, onSquareClick}) {
    return (
        <button onClick={onSquareClick}>{value}</button>
    )
}

function Board() {
    const [xIsNext, setXIsNext] = useState(true);
    const [squares, setSquares] = useState(Array(9).fill(null));

    function handleSquareClick(i) {
        if (squares[i] || winner(squares)) {
            return;
        }
        const newSquares = squares.slice();
        newSquares[i] = xIsNext ? "X" : "O";
        setXIsNext(!xIsNext);
        setSquares(newSquares);
    }

    function winner() {
        const sets = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,8]];
        for (let set of sets) {
            const [a,b,c] = set;
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
            {
                return squares[a];
            }
        }
        return null;
    }

    const renderBoard = squares.map((square, index) => {
        const row = [];  
    });

    function render(squares) {
        const board = []
        for (let i=0; i<3; i++) {
            let row = [];
            for (let j=0; j<3; j++) {
                row.push(<Square key={(i*3)+j} value={squares[(i*3)+j]} onSquareClick={()=>handleSquareClick((i*3)+j)} />);
            }
            board.push(<div key={i} className='board-row'>{row}</div>);
        }
        return board;
    }

    function updateStatus() {
        if (winner()) {
            return `The Winner is: ${winner()}`;
        }
        return `next player: ${xIsNext? 'X' : 'O'}`;
    }

    return (
        <div>
            <div className='status'>
                {updateStatus()}
            </div>
            <div className='board'>
                {render(squares)}
            </div>
        </div>
    )
}

export default function Game() {
    return (
        <Board />
    )
}