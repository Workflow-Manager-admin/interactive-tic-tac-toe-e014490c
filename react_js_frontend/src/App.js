import React, { useState, useEffect } from 'react';
import './App.css';

// Utility for determining winner
const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
};

// Returns an array of empty square indexes
const emptySquares = (squares) =>
  squares
    .map((s, idx) => (s ? null : idx))
    .filter((val) => val !== null);

// Very basic AI: chooses first empty square
const aiMove = (squares) => {
  const empties = emptySquares(squares);
  return empties.length ? empties[0] : null;
};

const PLAYER_X = 'X';
const PLAYER_O = 'O';

// PUBLIC_INTERFACE
function App() {
  // 'player' is who the user is, 'opponent' can be another user or AI
  const [singlePlayer, setSinglePlayer] = useState(false);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true); // X always starts
  const [status, setStatus] = useState('');
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [theme, setTheme] = useState('light');
  const [aiThinking, setAiThinking] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Effect for game winner/draw update
  useEffect(() => {
    const win = calculateWinner(board);
    if (win) {
      setWinner(win);
      setStatus(win === PLAYER_X ? 'Player X wins!' : (singlePlayer && win === PLAYER_O ? 'AI wins!' : 'Player O wins!'));
      setIsDraw(false);
    } else if (board.every((sq) => sq)) {
      setWinner(null);
      setIsDraw(true);
      setStatus("It's a draw!");
    } else {
      setWinner(null);
      setIsDraw(false);
      setStatus('');
    }
  }, [board, singlePlayer]);

  // Effect for automatic AI move in single player when O's turn and game not ended
  useEffect(() => {
    if (
      singlePlayer &&
      !winner &&
      !isDraw &&
      !xIsNext // O's turn
    ) {
      setAiThinking(true);
      const timeout = setTimeout(() => {
        const aiIdx = aiMove(board);
        if (aiIdx !== null) {
          handleSquareClick(aiIdx);
        }
        setAiThinking(false);
      }, 500); // short delay for UX
      return () => clearTimeout(timeout);
    }
  }, [singlePlayer, board, xIsNext, winner, isDraw]);

  // PUBLIC_INTERFACE
  const handleSquareClick = (idx) => {
    if (board[idx] || winner || (singlePlayer && !xIsNext)) return;
    const newBoard = board.slice();
    newBoard[idx] = xIsNext ? PLAYER_X : PLAYER_O;
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const handleModeChange = (event) => {
    const isSingle = event.target.value === 'single';
    setSinglePlayer(isSingle);
    handleReset(isSingle);
  };

  // PUBLIC_INTERFACE
  const handleReset = (keepMode = singlePlayer) => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setIsDraw(false);
    setStatus('');
    setSinglePlayer(keepMode);
    setAiThinking(false);
  };

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const accent = "#f59e42";
  const primary = "#4f46e5";
  const secondary = "#818cf8";

  // Styles for main TicTacToe grid & controls
  const boardStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 64px)",
    gridTemplateRows: "repeat(3, 64px)",
    gap: "12px",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
  };
  const cellStyle = {
    width: "64px",
    height: "64px",
    background: "var(--bg-secondary, #f8f9fa)",
    color: "var(--text-primary, #282c34)",
    fontSize: "2.2rem",
    fontWeight: "bold",
    border: `2px solid ${secondary}`,
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    userSelect: "none",
    transition: "background 0.2s, color 0.2s",
    outline: 'none',
  };
  const disabledCellStyle = {
    ...cellStyle,
    cursor: "default",
    color: "var(--border-color, #e9ecef)",
  };
  const indicatorStyle = {
    color: accent,
    textAlign: "center",
    fontSize: "1.2rem",
    marginBottom: "10px",
    fontWeight: 500,
    letterSpacing: "0.04em",
    minHeight: "28px",
  };
  const statusStyle = {
    color: winner ? primary : secondary,
    fontWeight: 700,
    fontSize: "1.2rem",
    minHeight: "28px",
    marginBottom: "8px",
    letterSpacing: '0.03em',
    textAlign: "center"
  };
  const controlRow = {
    marginTop: "24px",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  };
  const btn = {
    background: primary,
    color: "#fff",
    border: "none",
    padding: "10px 28px",
    fontSize: "1rem",
    borderRadius: "18px",
    cursor: "pointer",
    fontWeight: 600,
    letterSpacing: "0.03em",
    transition: "background 0.2s,color 0.2s",
    boxShadow: `0 2px 8px ${secondary}11`,
    margin: "0 6px",
  };
  const btnAccent = {
    ...btn, background: accent, color: "#fff"
  };
  const selectStyle = {
    ...btn, background: secondary, color: "#fff", padding: "10px 18px",
  };
  // Accessibility: Label for mode
  const modeLabel = singlePlayer ? "Playing: You (X) vs AI (O)" : "Playing: Player X vs Player O";
  const nextPlayer = winner || isDraw ? null : (xIsNext ? (singlePlayer ? "You (X)" : "Player X") : (singlePlayer ? "AI (O)" : "Player O"));

  // Game board render
  return (
    <div className="App" style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", background: "var(--bg-primary,#fff)" }}>
      <main style={{
        background: "var(--bg-secondary,#f8f9fa)",
        padding: "32px 24px 24px 24px",
        borderRadius: "26px",
        boxShadow: "0 8px 38px rgba(79,70,229,0.08)",
        maxWidth: "380px",
        width: "100%",
        margin: "36px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        {/* Theme toggle */}
        <button
          className="theme-toggle"
          style={{ position: "absolute", top: 26, right: 26 }}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        {/* Game Title */}
        <h1 style={{
          margin: 0,
          color: primary,
          fontWeight: 900,
          fontSize: "1.9rem",
          letterSpacing: "0.04em",
          userSelect: "none"
        }}>Tic Tac Toe</h1>
        <div
          aria-label="Current Game Mode"
          style={{
            margin: "0 0 10px 0",
            fontSize: "1rem",
            color: secondary,
            fontWeight: 500,
          }}>{modeLabel}</div>
        {/* Status message */}
        <div style={statusStyle}>
          {winner && <>
            <span>{status}</span>
          </>}
          {!winner && isDraw && <span>{status}</span>}
        </div>
        {/* Next player indicator */}
        {!winner && !isDraw && (
          <div style={indicatorStyle}>
            {aiThinking ? "AI is thinking..." : `Next: ${nextPlayer}`}
          </div>
        )}
        {/* Game board */}
        <div
          style={boardStyle}
          role="grid"
          aria-label="Tic Tac Toe Board"
        >
          {board.map((cell, idx) => (
            <button
              key={idx}
              aria-label={`cell ${idx + 1}, ${cell || 'empty'}`}
              style={cell || winner || (singlePlayer && !xIsNext) || aiThinking ? disabledCellStyle : cellStyle}
              onClick={() => handleSquareClick(idx)}
              disabled={!!cell || !!winner || (singlePlayer && !xIsNext) || aiThinking}
              tabIndex={0}
            >
              {cell}
            </button>
          ))}
        </div>
        {/* Controls */}
        <div style={controlRow}>
          <select
            value={singlePlayer ? "single" : "multi"}
            onChange={handleModeChange}
            style={selectStyle}
            aria-label="Choose Game Mode"
            disabled={board.some(c => c)} // lock during active game
          >
            <option value="multi">2 Player</option>
            <option value="single">Vs AI</option>
          </select>
          <button onClick={() => handleReset()} style={btnAccent} aria-label="Restart Game">
            {winner || isDraw ? 'Play Again' : 'Reset'}
          </button>
        </div>
        {/* Footer */}
        <footer style={{ textAlign: "center", color: "#4f46e577", marginTop: 30, fontSize: 12 }}>
          <span>
            <span style={{ color: accent, fontWeight: 700 }}>KAVIA</span> minimal React Tic Tac Toe
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;
