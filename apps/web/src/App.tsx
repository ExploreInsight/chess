// ** import types
import type { GameState, Move, PieceType, Position } from "@chess-game/chess";

// ** import lib
import { useState } from "react";
import {
  agreeDraw,
  applyMove,
  checkedKing,
  createInitialGameState,
  getLegalMoves,
  resign,
} from "@chess-game/chess";
import { ChessBoard } from "@chess-game/ui";

// ** import styles
import "./styles.css";

const PROMOTION_LABELS: Record<PieceType, string> = {
  queen: "Queen",
  rook: "Rook",
  bishop: "Bishop",
  knight: "Knight",
  king: "King",
  pawn: "Pawn",
};

function statusText(game: GameState): string {
  const color = game.currentPlayer === "white" ? "White" : "Black";
  if (game.result === "checkmate" && game.winner) {
    return `Checkmate! ${game.winner === "white" ? "White" : "Black"} wins`;
  }
  if (game.result === "resignation" && game.winner) {
    return `${game.winner === "white" ? "Black" : "White"} resigns`;
  }
  if (game.result === "stalemate") return "Draw by stalemate";
  if (game.result === "threefold") return "Draw by threefold repetition";
  if (game.result === "fifty-move") return "Draw by the fifty-move rule";
  if (game.result === "insufficient-material") return "Draw by insufficient material";
  if (game.result === "agreement") return "Draw by agreement";
  if (game.isCheck) return `Check! ${color} to move`;
  return `${color} to move`;
}

export default function App() {
  const [game, setGame] = useState(createInitialGameState);
  const [selected, setSelected] = useState<Position | null>(null);
  const [promotions, setPromotions] = useState<Move[]>([]);
  const legal = selected ? getLegalMoves(game, selected) : [];
  const targets = legal
    .filter(
      (move, index, all) =>
        all.findIndex((item) => item.to.row === move.to.row && item.to.col === move.to.col) === index,
    )
    .map((move) => move.to);
  const finished = game.isCheckmate || game.isDraw || game.winner !== null;

  function finishMove(move: Move) {
    setGame(applyMove(game, move));
    setSelected(null);
    setPromotions([]);
  }

  function onSquareClick(position: Position) {
    if (finished || promotions.length > 0) return;

    if (selected) {
      const choices = legal.filter(
        (candidate) => candidate.to.row === position.row && candidate.to.col === position.col,
      );
      if (choices.length > 1) {
        setPromotions(choices);
        return;
      }
      if (choices[0]) {
        finishMove(choices[0]);
        return;
      }

      const piece = game.board[position.row]?.[position.col];
      if (
        piece?.color === game.currentPlayer &&
        (selected.row !== position.row || selected.col !== position.col)
      ) {
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
    setPromotions([]);
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
      {promotions.length > 0 ? (
        <div className="promotion">
          {promotions.map((move) => (
            <button key={move.promotion} type="button" onClick={() => finishMove(move)}>
              {PROMOTION_LABELS[move.promotion ?? "queen"]}
            </button>
          ))}
        </div>
      ) : null}
      <div className="actions">
        <button type="button" className="reset" onClick={resetGame}>
          New Game
        </button>
        <button type="button" className="reset" disabled={finished} onClick={() => setGame(resign(game))}>
          Resign
        </button>
        <button type="button" className="reset" disabled={finished} onClick={() => setGame(agreeDraw(game))}>
          Agree Draw
        </button>
      </div>
    </main>
  );
}
