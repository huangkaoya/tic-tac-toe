import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            style={{
                color: props.red ? 'rgb(117, 10, 10)' : '',
                backgroundColor: props.highlight ? 'lightcoral' : '',
            }}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i, index) {
        const winnerLine = this.props.winnerLine || []
        const pos = this.props.nowStep
        const posX = pos[0]
        const posY = pos[1]
        const posNum = 3 * (posY - 1) + posX - 1 // 通过坐标转换为渲染值
        return (
            <Square
                key={index}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                red={i === posNum}
                highlight={winnerLine.includes(i)}
            />
        );
    }
    render() {
        const board = Array(3).fill(null).map((item, i) => {
            const row = Array(3).fill(null).map((item, j) => {
                return (
                    this.renderSquare(3 * i + j, i + '' + j)
                )
            })
            return (
                <div key={i + ''} className="board-row">
                    {row}
                </div>
            )
        })
        return (
            <div>
                {board}
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                nowStep: [null, null], // [列，行]
            }],
            boldClass: Array(9).fill(null), // 井字格游戏最多只有九步
            stepNumber: 0,
            xIsNext: true,
            isAsc: true, // 默认升序排序历史记录
        }
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1) // 去除掉不正确的“未来”步骤 
        const current = history[history.length - 1]
        const squares = current.squares.slice();
        const { winner } = calculateWinner(squares)
        if (winner || squares[i]) {
            return;
        }
        const nowStep = [i % 3 + 1, Math.floor(i / 3) + 1]
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                nowStep: nowStep
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            boldClass: Array(9).fill(null)
        });
    }
    jumpTo(step) {
        const boldClass = Array(9).fill(null)
        boldClass[step] = 'bold-font'
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0,
            boldClass: boldClass
        })
    }
    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const { winner, line } = calculateWinner(current.squares)

        const moves = history.map((step, move) => {
            const desc = move ?
                `前往第 #${move}步(${step.nowStep[0]},${step.nowStep[1]})` :
                '前往游戏开始';
            return (
                <li key={move}>
                    <button onClick={() => { this.jumpTo(move) }} className={this.state.boldClass[move]}>{desc}</button>
                </li>
            )
        })
        const drawFlag = current.squares.every(item => !!item)
        let status
        if (winner) {
            status = '获胜者是: ' + winner
        } else if (drawFlag) {
            status = '平局！';
        } else {
            status = '下一手: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        nowStep={current.nowStep}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winnerLine={line}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div className="game-sort">
                        <span>历史记录排序：</span>
                        <button onClick={() => { this.setState({ isAsc: true }) }}>升序</button>
                        <button onClick={() => { this.setState({ isAsc: false }) }}>降序</button>
                    </div>
                    <ol>{this.state.isAsc ? moves : moves.reverse()}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Game></Game>
    </React.StrictMode>
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                line: lines[i]
            };
        }
    }
    return {
        winner: null,
        line: [null, null, null]
    };
}

