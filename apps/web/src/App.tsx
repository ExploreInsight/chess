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
  toAlgebraic,
  undoMove,
} from "@chess-game/chess";
import { ChessBoard, pieceSymbol } from "@chess-game/ui";

import { PromotionDialog } from "@/components/promotion-dialog";
import { Button } from "@/components/ui/button";

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
  const [flipped, setFlipped] = useState(false);
  const legal = selected ? getLegalMoves(game, selected) : [];
  const targets = legal
    .filter(
      (move, index, all) =>
        all.findIndex((item) => item.to.row === move.to.row && item.to.col === move.to.col) === index,
    )
    .map((move) => move.to);
  const finished = game.isCheckmate || game.isDraw || game.winner !== null;
  const status = statusText(game);

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

  function onUndo() {
    const next = undoMove(game);
    if (next) {
      setGame(next);
      setSelected(null);
      setPromotions([]);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <ChessBoard
        board={game.board}
        selected={selected}
        targets={targets}
        checkedKing={checkedKing(game)}
        flipped={flipped}
        onSquareClick={onSquareClick}
      />

      <p role="status" aria-live="polite" className="m-0">
        {status}
      </p>

      <div className="flex gap-2">
        <Button onClick={resetGame}>New Game</Button>
        <Button onClick={() => setFlipped((f) => !f)}>{flipped ? "Unflip" : "Flip"}</Button>
        <Button disabled={finished || game.history.length === 0} onClick={onUndo}>
          Undo
        </Button>
        <Button disabled={finished} onClick={() => setGame(resign(game))}>
          Resign
        </Button>
        <Button disabled={finished} onClick={() => setGame(agreeDraw(game))}>
          Agree Draw
        </Button>
      </div>

      {game.moveHistory.length > 0 ? (
        <ol
          aria-label="Move list"
          className="m-0 flex max-w-[min(560px,calc(100vw-48px))] flex-wrap gap-x-3 gap-y-1 p-0 text-sm"
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
                <span className="text-ink-muted">{pair + 1}.</span>
                <span className={pair === Math.floor((game.moveHistory.length - 1) / 2) ? "text-ink" : ""}>
                  {whiteBefore ? toAlgebraic(white, whiteBefore) : ""}
                </span>
                {black && blackBefore ? (
                  <span className={pair === Math.floor((game.moveHistory.length - 1) / 2) ? "text-ink" : ""}>
                    {toAlgebraic(black, blackBefore)}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      ) : null}

      <PromotionDialog
        isOpen={promotions.length > 0}
        onClose={() => setPromotions([])}
        choices={promotions.map((move) => ({
          label: PROMOTION_LABELS[move.promotion ?? "queen"],
          symbol: pieceSymbol({
            type: move.promotion ?? "queen",
            color: game.currentPlayer,
            hasMoved: true,
          }),
          onSelect: () => finishMove(move),
        }))}
      />
    </main>
  );
}
