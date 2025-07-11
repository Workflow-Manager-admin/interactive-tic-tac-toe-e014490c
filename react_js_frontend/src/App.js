import React, { useState, useEffect } from 'react';
import './App.css';

// Colors: primary #4f46e5, secondary #818cf8, accent #f59e42

// Helper constants
const COLORS = {
  primary: '#4f46e5',
  secondary: '#818cf8',
  accent: '#f59e42',
};

const emptyBoard = () => Array(9).fill(null);
const PLAYER_X = 'X';
const PLAYER_O = 'O';

/**
 * Calculate winner.
 * @param {Array} squares Array of 9 board values.
 * @returns {string|null} Returns "X", "O" or null if no winner.
 */
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6],          // diagonals
  ];
  for (let [a,b,c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function isBoardFull(squares) {
  return squares.every((sq) => sq !== null);
}

/**
 * Naive AI: picks first available spot.
 * @param {Array} squares
 * @returns {number} index to play
 */
// PUBLIC_INTERFACE
function getAIMove(squares) {
  for (let i=0; i < 9; i++) {
    if (!squares[i]) return i;
  }
  return -1;
}

// Square component
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? ' win' : ''}`}
      onClick={onClick}
      aria-label={`Square ${value || 'empty'}`}
      style={{
        color: value === PLAYER_X
          ? COLORS.primary
          : value === PLAYER_O
          ? COLORS.accent
          : undefined,
      }}
      disabled={!!value}
      tabIndex={value ? -1 : 0}
    >
      {value}
    </button>
  );
}

// Board component
function Board({ squares, onSquareClick, winLine }) {
  function renderSquare(i) {
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        highlight={winLine && winLine.includes(i)}
      />
    );
  }
  // Centered grid
  return (
    <div className="ttt-board">
      {[0, 1, 2].map(row =>
        <div className="ttt-row" key={row}>
          {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
        </div>
      )}
    </div>
  );
}

/**
 * Main Tic Tac Toe app.
 * @returns {JSX.Element}
 */
// PUBLIC_INTERFACE
function App() {
  // State
  const [theme] = useState('light'); // Fixed to light for minimal UI
  const [mode, setMode] = useState('2P'); // '2P' | 'AI'
  const [squares, setSquares] = useState(emptyBoard());
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winLine, setWinLine] = useState(null); // for highlight
  const [status, setStatus] = useState('');
  const [gameOver, setGameOver] = useState(false);

  // Reset/replay handler
  const handleReset = () => {
    setSquares(emptyBoard());
    setIsXNext(true);
    setWinner(null);
    setWinLine(null);
    setStatus('');
    setGameOver(false);
  };

  // Detect winner/draw
  useEffect(() => {
    const win = calculateWinner(squares);
    if (win) {
      setWinner(win);
      setWinLine(findWinningLine(squares));
      setStatus(`Winner: ${win}`);
      setGameOver(true);
      return;
    }
    if (isBoardFull(squares)) {
      setWinner(null);
      setWinLine(null);
      setStatus('Draw!');
      setGameOver(true);
      return;
    }
    setStatus(`Next: ${isXNext ? 'X' : 'O'}`);
  }, [squares, isXNext]);

  // For AI -- play on O's turn after X
  useEffect(() => {
    if (mode === 'AI' && !gameOver && !winner && !isXNext) {
      // Delay for UX
      const timer = setTimeout(() => {
        const idx = getAIMove(squares);
        if (idx !== -1) {
          handleMove(idx);
        }
      }, 450);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line
  }, [mode, squares, isXNext, winner, gameOver]);

  // PUBLIC_INTERFACE
  function handleMove(idx) {
    if (squares[idx] || winner || gameOver) return;
    const nextSquares = squares.slice();
    nextSquares[idx] = isXNext ? PLAYER_X : PLAYER_O;
    setSquares(nextSquares);
    setIsXNext(!isXNext);
  }

  // PUBLIC_INTERFACE
  function handleModeChange(e) {
    setMode(e.target.value);
    handleReset();
  }

  // Find which line is winning (for highlight)
  // PUBLIC_INTERFACE
  function findWinningLine(sq) {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6],
    ];
    for (let line of lines) {
      const [a,b,c] = line;
      if(sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) return line;
    }
    return null;
  }

  // UI
  return (
    <div className="App" style={{ background: '#f9f9fe', minHeight: '100vh' }}>
      <main className="ttt-centerwrap">
        <div className="ttt-title">tic tac toe</div>
        <div className="ttt-mode-toggle">
          <label>
            <input
              type="radio"
              name="mode"
              value="2P"
              checked={mode === '2P'}
              onChange={handleModeChange}
            />
            2 Players
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              value="AI"
              checked={mode === 'AI'}
              onChange={handleModeChange}
            />
            1 Player vs AI
          </label>
        </div>
        <div className="ttt-status" data-testid="status">
          {status}
        </div>
        <Board squares={squares} onSquareClick={handleMove} winLine={winLine} />
        <div className="ttt-controls">
          <button className="ttt-btn" onClick={handleReset}>
            Reset
          </button>
        </div>
        <footer className="ttt-footer">
          <span style={{fontSize:'12px', color:'#b1b1bb'}}>Modern minimal tic tac toe — 
            <span style={{color:COLORS.primary}}>Primary</span>, <span style={{color:COLORS.secondary}}>Secondary</span>, <span style={{color:COLORS.accent}}>Accent</span> theme
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;
