// ** import types
import type { Board, GameState, PlayerColor } from "./types";

// ** import lib
import { enPassantTarget } from "./moves";

function squareColor(row: number, col: number): "light" | "dark" {
  return (row + col) % 2 === 0 ? "light" : "dark";
}

export function positionKey(state: Pick<GameState, "board" | "currentPlayer" | "moveHistory">): string {
  const board = state.board
    .map((row) =>
      row
        .map((piece) => (piece ? `${piece.color[0]}${piece.type[0]}${piece.hasMoved ? "1" : "0"}` : "."))
        .join(""),
    )
    .join("/");
  const passed = enPassantTarget(state.moveHistory, state.board);
  return `${board} ${state.currentPlayer} ${passed ? `${passed.row}${passed.col}` : "-"}`;
}

export function isInsufficientMaterial(board: Board): boolean {
  const pieces = board.flat().filter((piece) => piece !== null);
  const minors = pieces.filter((piece) => piece.type !== "king");
  if (minors.length === 0) return true;
  if (minors.length === 1 && (minors[0]?.type === "bishop" || minors[0]?.type === "knight")) return true;
  if (minors.length === 2 && minors.every((piece) => piece.type === "bishop")) {
    const squares: Array<"light" | "dark"> = [];
    board.forEach((row, rowIndex) => {
      row.forEach((piece, colIndex) => {
        if (piece?.type === "bishop") squares.push(squareColor(rowIndex, colIndex));
      });
    });
    return squares[0] !== undefined && squares[0] === squares[1];
  }
  return false;
}

export function repetitionCount(history: string[], key: string): number {
  return history.filter((entry) => entry === key).length;
}

export function nextHalfmoveClock(state: GameState, move: { from: { row: number; col: number }; to: { row: number; col: number }; enPassant?: boolean }): number {
  const piece = state.board[move.from.row]?.[move.from.col];
  const captured = state.board[move.to.row]?.[move.to.col];
  if (piece?.type === "pawn" || captured || move.enPassant) return 0;
  return state.halfmoveClock + 1;
}

export function sideName(color: PlayerColor): string {
  return color === "white" ? "White" : "Black";
}
