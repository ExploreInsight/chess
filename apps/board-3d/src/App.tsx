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
  toAlgebraic,
  undoMove,
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

  function onUndo() {
    const next = undoMove(game);
    if (next) {
      setGame(next);
      setSelected(null);
      setPromotions([]);
    }
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
    <main className="h-full w-full">
      <Canvas shadows camera={{ position: [0, 9, 8], fov: 42 }}>
        <ChessScene
          board={game.board}
          selected={selected}
          targets={legal.map((move) => move.to)}
          checkedKing={checkedKing(game)}
          onSquareClick={onSquareClick}
        />
      </Canvas>
      {game.moveHistory.length > 0 ? (
        <ol
          aria-label="Move list"
          className="fixed bottom-6 right-6 m-0 flex max-w-[40vw] flex-wrap justify-end gap-x-3 gap-y-1 p-2 text-sm"
        >
          {Array.from({ length: Math.ceil(game.moveHistory.length / 2) }, (_, pair) => {
            const whiteIndex = pair * 2;
            const blackIndex = whiteIndex + 1;
            const whiteBefore = game.history[whiteIndex];
            const blackBefore = game.history[blackIndex];
            const white = game.moveHistory[whiteIndex]!;
            const black = game.moveHistory[blackIndex];
            return (
              <li key={pair} className="flex gap-1">
                <span>{pair + 1}.</span>
                <span>{whiteBefore ? toAlgebraic(white, whiteBefore) : ""}</span>
                {black && blackBefore ? <span>{toAlgebraic(black, blackBefore)}</span> : null}
              </li>
            );
          })}
        </ol>
      ) : null}
      <div className="fixed bottom-6 left-6 flex flex-col gap-2.5">
        <p role="status" aria-live="polite" className="m-0">
          {statusText(game)}
        </p>
        {promotions.length > 0 ? (
          <div role="group" aria-label="Choose promotion piece" className="flex gap-2">
            {promotions.map((move) => (
              <button key={move.promotion} type="button" onClick={() => finishMove(move)}>
                {PROMOTION_LABELS[move.promotion ?? "queen"]}
              </button>
            ))}
          </div>
        ) : null}
        <div role="group" aria-label="Game controls" className="flex gap-2">
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
          <button type="button" disabled={finished || game.history.length === 0} onClick={onUndo}>
            Undo
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
