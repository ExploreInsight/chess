// ** import types
import type { Board, Piece, Position } from "@chess-game/chess";

// ** import lib
import { useRef } from "react";

import { pieceSymbol } from "./piece-symbol";

export interface ChessBoardProps {
  board: Board;
  selected: Position | null;
  targets: Position[];
  checkedKing: Position | null;
  flipped: boolean;
  onSquareClick: (position: Position) => void;
}

const FILE_LABELS = ["a", "b", "c", "d", "e", "f", "g", "h"];

function matches(position: Position | null, row: number, col: number): boolean {
  return position?.row === row && position.col === col;
}

function fileLabel(col: number, flipped: boolean): string {
  return FILE_LABELS[flipped ? 7 - col : col]!;
}

function rankLabel(row: number, flipped: boolean): number {
  return flipped ? row + 1 : 8 - row;
}

function squareLabel(piece: Piece | null, row: number, col: number, flipped: boolean): string {
  const name = `${fileLabel(col, flipped)}${rankLabel(row, flipped)}`;
  if (!piece) return `${name}, empty`;
  return `${name}, ${piece.color} ${piece.type}`;
}

export function ChessBoard({
  board,
  selected,
  targets,
  checkedKing,
  flipped,
  onSquareClick,
}: ChessBoardProps) {
  const focusRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const focusRow = selected?.row ?? 7;
  const focusCol = selected?.col ?? 4;

  function moveFocus(row: number, col: number) {
    const nextRow = (row + 8) % 8;
    const nextCol = (col + 8) % 8;
    focusRef.current.get(`${nextRow}-${nextCol}`)?.focus();
  }

  const displayRows = flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
  const displayCols = flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <div
      role="grid"
      aria-label={flipped ? "Chessboard, flipped" : "Chessboard"}
      className="grid aspect-square w-[min(560px,calc(100vw-48px))] grid-cols-8 grid-rows-8 border-8 border-surface shadow-[0_18px_40px_rgb(0_0_0/0.35)]"
    >
      {displayRows.map((engineRow, displayRowIndex) => (
        <div role="row" key={displayRowIndex} className="contents">
          {displayCols.map((engineCol, displayColIndex) => {
            const piece = board[engineRow]?.[engineCol] ?? null;
            const isDark = (displayRowIndex + displayColIndex) % 2 === 1;
            const isSelected = matches(selected, engineRow, engineCol);
            const isTarget = targets.some((target) => matches(target, engineRow, engineCol));
            const isCheck = matches(checkedKing, engineRow, engineCol);

            const tone = isCheck
              ? "bg-square-check"
              : isSelected
                ? "bg-square-selected"
                : isDark
                  ? "bg-square-dark"
                  : "bg-square-light";

            return (
              <button
                key={`${displayRowIndex}-${displayColIndex}`}
                ref={(node) => {
                  if (node) focusRef.current.set(`${engineRow}-${engineCol}`, node);
                  else focusRef.current.delete(`${engineRow}-${engineCol}`);
                }}
                type="button"
                role="gridcell"
                tabIndex={engineRow === focusRow && engineCol === focusCol ? 0 : -1}
                aria-label={squareLabel(piece, displayRowIndex, displayColIndex, flipped)}
                aria-selected={isSelected}
                onFocus={() => undefined}
                onClick={() => onSquareClick({ row: engineRow, col: engineCol })}
                onKeyDown={(event) => {
                  const deltas: Record<string, [number, number]> = {
                    ArrowUp: [-1, 0],
                    ArrowDown: [1, 0],
                    ArrowLeft: [0, -1],
                    ArrowRight: [0, 1],
                  };
                  const delta = deltas[event.key];
                  if (delta) {
                    event.preventDefault();
                    moveFocus(engineRow + delta[0], engineCol + delta[1]);
                    return;
                  }
                  if (event.key === "Home") {
                    event.preventDefault();
                    moveFocus(engineRow, 0);
                    return;
                  }
                  if (event.key === "End") {
                    event.preventDefault();
                    moveFocus(engineRow, 7);
                  }
                }}
                className={`relative flex cursor-pointer items-center justify-center overflow-hidden border-0 p-0 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-ink ${tone}`}
              >
                {piece ? (
                  <span
                    className={`pointer-events-none relative z-1 text-[calc(min(560px,100vw-48px)/12)] leading-none select-none ${
                      piece.color === "white"
                        ? "text-piece-white [-webkit-text-stroke:1px_var(--color-piece-black)]"
                        : "text-piece-black"
                    }`}
                  >
                    {pieceSymbol(piece)}
                  </span>
                ) : null}
                {isTarget ? (
                  <span className="absolute h-[18%] w-[18%] rounded-full bg-move-indicator" />
                ) : null}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
