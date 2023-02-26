import {useState} from 'react';

function Square({value, onSquareClick}) {
    return (
        <button onClick={onSquareClick}>{value}</button>
    )
}

function Board({squares, xIsNext, onPlay}) {

    const winningPlayer = winner(squares)[0];
    const winningSet = winner(squares)[1];

    function handleSquareClick(index) {
        if (squares[index] || winningPlayer) {
            return;
        }
        const newSquares = squares.slice();
        newSquares[index] = xIsNext ? "X" : "O";
       
        onPlay(newSquares, index);
    }

    function render(squares) {
        const board = [];
        for (let i=0; i<3; i++) {
            let row = [];
            for (let j=0; j<3; j++) {
                let style = "square";
                if (winningPlayer && winningSet.includes(i*3+j)) {
                    style = "win-square";
                }
                row.push(
                    <div className={style}>
                        <Square key={(i*3)+j} value={squares[(i*3)+j]} onSquareClick={()=>handleSquareClick(i*3+j)} />
                    </div>
                );
            }
            board.push(<div key={i} className='board-row'>{row}</div>);
        }
        return board;
    }

    function updateStatus() {
        if (winningPlayer) {
            return `The Winner is: ${winningPlayer}`;
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
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [current, setCurrent] = useState(0);
    const [orderAscending, setOrderAscending] = useState(true)
    const [clickedSquares, setclickedSquares] = useState([null])
    let ascButtonClass = orderAscending ? "buttonSelected" : "";
    let descButtonClass = orderAscending ? "" : "buttonSelected";

    const xIsNext = current % 2 === 0;
    

    function handlePlay(newSquares, index) {
        setHistory([...history.slice(0, current+1), newSquares]);
        setCurrent(current+1);
        //why current+1
        //make it immutable?
        //how to handle history?
        //clickedSquares[current+1] = index;
        let newClickedSquares = [...clickedSquares.slice(0, current+1), index];
        console.log(newClickedSquares);
        setclickedSquares(newClickedSquares);
    }

    function timeTravel(i) {
        setCurrent(i);
    }

    //convert index to col, row
    //each history li is a component withown state
    //2 => 2 0, 1 1, 0 2
    //4 => 1 1  
    const renderHistory = history.map((squares, index)=>{
        let sq = clickedSquares[index];
        let [col, row] = indexTo2D(sq);
        let message = `Go To Move ${index} (${col}, ${row})`;
        if (index===0) {
            message = "Go To Start";
        }
        let elem;
        if (index === current && index > 0) {
            elem = "You are on move #" + index + " (" + col+", "+row +")" ;
        } else {
            elem = <button onClick={() => timeTravel(index)}>{message}</button>;
        }
        return (
            <li key={index}>
                {elem}
            </li>
        )
    });

    
    //<History orderAscending={orderAscending} history={history} point={lastPoint}/>

    return (
        <div className="game">
            <div className='board'>
                <Board squares={history[current]} xIsNext={xIsNext} onPlay={handlePlay}/>
            </div>
            <div className='history'>
                <div>
                    <button className={ascButtonClass} onClick={()=>{setOrderAscending(true)}}>Ascending</button>            
                    <button className={descButtonClass} onClick={()=>{setOrderAscending(false)}}>Descending</button>
                </div>
                <ol>
                    {orderAscending ? renderHistory: renderHistory.reverse()}
                </ol>
            </div>
        </div>
    )
}

function winner(squares) {
    const sets = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let set of sets) {
        const [a,b,c] = set;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
        {
            return [squares[a], set];
        }
    }
    return [null, null];
}

function indexTo2D(index) {
    let col = index % 3;
    let row = Math.floor(index/3);

    return [++col, ++row]
}