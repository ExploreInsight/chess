// ** import types
import type { GameState, Move, PieceType, Position } from "@chess-game/chess";

// ** import lib
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import {
  agreeDraw,
  applyMove,
  checkedKing,
  createInitialGameState,
  getLegalMoves,
  resign,
} from "@chess-game/chess";

import { ChessScene } from "./scene";

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
      if (piece?.color === game.currentPlayer) {
        setSelected(position);
        return;
      }
      setSelected(null);
      return;
    }
    const piece = game.board[position.row]?.[position.col];
    if (piece?.color === game.currentPlayer) setSelected(position);
  }

  return (
    <main className="stage">
      <Canvas shadows camera={{ position: [0, 9, 8], fov: 42 }}>
        <ChessScene
          board={game.board}
          selected={selected}
          targets={legal.map((move) => move.to)}
          checkedKing={checkedKing(game)}
          onSquareClick={onSquareClick}
        />
      </Canvas>
      <div className="hud">
        <p>{statusText(game)}</p>
        {promotions.length > 0 ? (
          <div className="row">
            {promotions.map((move) => (
              <button key={move.promotion} type="button" onClick={() => finishMove(move)}>
                {PROMOTION_LABELS[move.promotion ?? "queen"]}
              </button>
            ))}
          </div>
        ) : null}
        <div className="row">
          <button
            type="button"
            onClick={() => {
              setGame(createInitialGameState());
              setSelected(null);
              setPromotions([]);
            }}
          >
            New Game
          </button>
          <button type="button" disabled={finished} onClick={() => setGame(resign(game))}>
            Resign
          </button>
          <button type="button" disabled={finished} onClick={() => setGame(agreeDraw(game))}>
            Agree Draw
          </button>
        </div>
      </div>
    </main>
  );
}
