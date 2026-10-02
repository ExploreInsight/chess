// ** import types
import type { Board, Position } from "@chess-game/chess";

// ** import lib
import { pieceSymbol } from "./piece-symbol";

export interface ChessBoardProps {
  board: Board;
  selected: Position | null;
  targets: Position[];
  checkedKing: Position | null;
  onSquareClick: (position: Position) => void;
}

function matches(position: Position | null, row: number, col: number): boolean {
  return position?.row === row && position.col === col;
}

export function ChessBoard({
  board,
  selected,
  targets,
  checkedKing,
  onSquareClick,
}: ChessBoardProps) {
  return (
    <div className="board" role="grid" aria-label="Chessboard">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const isDark = (rowIndex + colIndex) % 2 === 1;
          const isSelected = matches(selected, rowIndex, colIndex);
          const isTarget = targets.some((target) => matches(target, rowIndex, colIndex));
          const isCheck = matches(checkedKing, rowIndex, colIndex);
          const className = [
            "square",
            isDark ? "square-dark" : "square-light",
            isSelected ? "square-selected" : "",
            isCheck ? "square-check" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              type="button"
              role="gridcell"
              className={className}
              onClick={() => onSquareClick({ row: rowIndex, col: colIndex })}
            >
              {piece ? <span className="piece">{pieceSymbol(piece)}</span> : null}
              {isTarget ? <span className="move-dot" /> : null}
            </button>
          );
        }),
      )}
    </div>
  );
}
