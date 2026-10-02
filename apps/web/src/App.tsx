// ** import types
import type { Position } from "@chess-game/chess";

// ** import lib
import { useState } from "react";
import {
  applyMove,
  checkedKing,
  createInitialGameState,
  getLegalMoves,
} from "@chess-game/chess";
import { ChessBoard } from "@chess-game/ui";

// ** import styles
import "./styles.css";

function statusText(game: ReturnType<typeof createInitialGameState>): string {
  const color = game.currentPlayer === "white" ? "White" : "Black";
  if (game.isCheckmate && game.winner) {
    const winner = game.winner === "white" ? "White" : "Black";
    return `Checkmate! ${winner} wins`;
  }
  if (game.isDraw) return "Draw by stalemate";
  if (game.isCheck) return `Check! ${color} to move`;
  return `${color} to move`;
}

export default function App() {
  const [game, setGame] = useState(createInitialGameState);
  const [selected, setSelected] = useState<Position | null>(null);
  const targets = selected ? getLegalMoves(game, selected).map((move) => move.to) : [];

  function onSquareClick(position: Position) {
    if (game.isCheckmate || game.isDraw) return;

    if (selected) {
      const move = getLegalMoves(game, selected).find(
        (candidate) => candidate.to.row === position.row && candidate.to.col === position.col,
      );
      if (move) {
        setGame(applyMove(game, move));
        setSelected(null);
        return;
      }

      const piece = game.board[position.row]?.[position.col];
      if (piece?.color === game.currentPlayer && (selected.row !== position.row || selected.col !== position.col)) {
        setSelected(position);
        return;
      }

      setSelected(null);
      return;
    }

    const piece = game.board[position.row]?.[position.col];
    if (piece?.color === game.currentPlayer) setSelected(position);
  }

  function resetGame() {
    setGame(createInitialGameState());
    setSelected(null);
  }

  return (
    <main className="app">
      <ChessBoard
        board={game.board}
        selected={selected}
        targets={targets}
        checkedKing={checkedKing(game)}
        onSquareClick={onSquareClick}
      />
      <p className="status">{statusText(game)}</p>
      <button type="button" className="reset" onClick={resetGame}>
        New Game
      </button>
    </main>
  );
}
