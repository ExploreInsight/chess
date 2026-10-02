// ** import types
import type { Board, PieceType } from "./types";

const BACK_RANK: PieceType[] = [
  "rook",
  "knight",
  "bishop",
  "queen",
  "king",
  "bishop",
  "knight",
  "rook",
];

export function createEmptyBoard(): Board {
  return Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => null));
}

export function createInitialBoard(): Board {
  const board = createEmptyBoard();

  for (let col = 0; col < 8; col += 1) {
    const type = BACK_RANK[col];
    if (!type) continue;
    board[0][col] = { type, color: "black", hasMoved: false };
    board[1][col] = { type: "pawn", color: "black", hasMoved: false };
    board[6][col] = { type: "pawn", color: "white", hasMoved: false };
    board[7][col] = { type, color: "white", hasMoved: false };
  }

  return board;
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((piece) => (piece ? { ...piece } : null)));
}

export function samePosition(
  a: { row: number; col: number },
  b: { row: number; col: number },
): boolean {
  return a.row === b.row && a.col === b.col;
}

export function isInside(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}
