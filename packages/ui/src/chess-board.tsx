// ** import types
import type { Board } from "@chess-game/chess";

// ** import lib
import { pieceSymbol } from "./piece-symbol";

export interface ChessBoardProps {
  board: Board;
}

export function ChessBoard({ board }: ChessBoardProps) {
  return (
    <div className="board" role="grid" aria-label="Chessboard">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const isDark = (rowIndex + colIndex) % 2 === 1;
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              role="gridcell"
              className={isDark ? "square square-dark" : "square square-light"}
            >
              {piece ? <span className="piece">{pieceSymbol(piece)}</span> : null}
            </div>
          );
        }),
      )}
    </div>
  );
}
