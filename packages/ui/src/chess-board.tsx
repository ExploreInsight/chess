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
  onSquareClick: (position: Position) => void;
}

const FILE_LABELS = ["a", "b", "c", "d", "e", "f", "g", "h"];

function matches(position: Position | null, row: number, col: number): boolean {
  return position?.row === row && position.col === col;
}

function squareLabel(piece: Piece | null, row: number, col: number): string {
  const name = `${FILE_LABELS[col]}${8 - row}`;
  if (!piece) return `${name}, empty`;
  return `${name}, ${piece.color} ${piece.type}`;
}

export function ChessBoard({
  board,
  selected,
  targets,
  checkedKing,
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

  return (
    <div
      role="grid"
      aria-label="Chessboard"
      className="grid aspect-square w-[min(560px,calc(100vw-48px))] grid-cols-8 grid-rows-8 border-8 border-surface shadow-[0_18px_40px_rgb(0_0_0/0.35)]"
    >
      {board.map((row, rowIndex) => (
        <div role="row" key={rowIndex} className="contents">
          {row.map((piece, colIndex) => {
            const isDark = (rowIndex + colIndex) % 2 === 1;
            const isSelected = matches(selected, rowIndex, colIndex);
            const isTarget = targets.some((target) => matches(target, rowIndex, colIndex));
            const isCheck = matches(checkedKing, rowIndex, colIndex);

            const tone = isCheck
              ? "bg-square-check"
              : isSelected
                ? "bg-square-selected"
                : isDark
                  ? "bg-square-dark"
                  : "bg-square-light";

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                ref={(node) => {
                  if (node) focusRef.current.set(`${rowIndex}-${colIndex}`, node);
                  else focusRef.current.delete(`${rowIndex}-${colIndex}`);
                }}
                type="button"
                role="gridcell"
                tabIndex={rowIndex === focusRow && colIndex === focusCol ? 0 : -1}
                aria-label={squareLabel(piece, rowIndex, colIndex)}
                aria-selected={isSelected}
                onFocus={() => undefined}
                onClick={() => onSquareClick({ row: rowIndex, col: colIndex })}
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
                    moveFocus(rowIndex + delta[0], colIndex + delta[1]);
                    return;
                  }
                  if (event.key === "Home") {
                    event.preventDefault();
                    moveFocus(rowIndex, 0);
                    return;
                  }
                  if (event.key === "End") {
                    event.preventDefault();
                    moveFocus(rowIndex, 7);
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
